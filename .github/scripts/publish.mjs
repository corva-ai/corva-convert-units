import * as path from 'path';
import { readFile, writeFile } from 'fs/promises';

export default async ({github, context, core, glob, io, exec, require}) => {
  const {TAG, NPM_TOKEN, WORKING_DIRECTORY} = process.env;

  const devVersionRegex = new RegExp('^v\\d+\\.\\d+\\.\\d+-\\d+$');
  const rcVersionRegex = new RegExp('^v\\d+\\.\\d+\\.\\d+-rc\\.\\d+$');
  const semanticVersionRegex = new RegExp('^v\\d+\\.\\d+\\.\\d+$');

  core.info(`Trying to get bump type for tag ${TAG}`);
  let bumpType;
  switch (true) {
    case devVersionRegex.test(TAG):
      bumpType = 'dev';
      break;
    case rcVersionRegex.test(TAG):
      bumpType = 'next';
      break;
    case semanticVersionRegex.test(TAG):
      bumpType = 'latest';
      break;
    case context.eventName === 'workflow_dispatch':
      core.warning(`Publishing a test version to NPM`);
      bumpType = 'test';
      await updatePackageJsonVersion(path.resolve(WORKING_DIRECTORY, 'package.json'), context.sha.slice(0, 7));
      break;
    default:
      core.setFailed(`Unable to determine bump type for tag ${TAG}`);
      return;
  }
  core.notice(`Computed bump type for tag ${TAG} is ${bumpType}`);

  core.info('Setting up NPM auth...');
  const npmrcContents = `//registry.npmjs.org/:_authToken=${NPM_TOKEN}`;
  await writeFile(path.resolve(WORKING_DIRECTORY, '.npmrc'), npmrcContents);

  core.info('Publishing NPM package...');
  const {stdout, stderr, exitCode} = await exec.getExecOutput(
    'npm',
    ['publish', '--tag', bumpType, '--access', 'public'],
    {silent: false, ignoreReturnCode: true, cwd: path.resolve(WORKING_DIRECTORY)}
  );

  if (exitCode === 0) {
    core.info('🎉 Published NPM package successfully!');
    return;
  }

  if (stderr.includes('You cannot publish over the previously published versions')) {
    core.warning('⚠️ This version was already published.');
    core.warning('⚠️ In most cases it\'s ok, the version will be updated in a separate pull request');
  } else if (stderr.includes('npm ERR!')) {
    core.setFailed(`❌ Failed to publish NPM package because of an error: ${stderr}`);
  } else {
    core.setFailed(`❌ Failed with unknown error: ${stderr}`);
  }
};

async function updatePackageJsonVersion(packageJsonPath, version) {
  const packageJsonContents = await readFile(packageJsonPath, {encoding: 'utf8'});
  const packageJson = JSON.parse(packageJsonContents);
  packageJson.version = `0.0.0-${version}`;
  return writeFile(packageJsonPath, JSON.stringify(packageJson))
}
