import * as path from 'path';
import { readFile, writeFile } from 'fs/promises';

export default async ({github, context, core, glob, io, exec, require}) => {
  const {TAG, NPM_TOKEN, WORKING_DIRECTORY} = process.env;

  // Strip component prefix (js@v1.0.0 -> v1.0.0)
  const version = TAG.includes('@') ? TAG.split('@').pop() : TAG;

  const devVersionRegex = /^v\d+\.\d+\.\d+-\d+$/;
  const rcVersionRegex = /^v\d+\.\d+\.\d+-rc\.\d+$/;
  const semanticVersionRegex = /^v\d+\.\d+\.\d+$/;

  core.info(`Trying to get bump type for tag ${TAG} (version ${version})`);
  let bumpType;
  switch (true) {
    case devVersionRegex.test(version):
      bumpType = 'dev';
      break;
    case rcVersionRegex.test(version):
      bumpType = 'next';
      break;
    case semanticVersionRegex.test(version):
      bumpType = 'latest';
      break;
    case context.eventName === 'workflow_dispatch':
      core.warning('Publishing a test version to NPM');
      bumpType = 'test';
      await updatePackageJsonVersion(path.resolve(WORKING_DIRECTORY, 'package.json'), context.sha.slice(0, 7));
      break;
    default:
      core.setFailed(`Unable to determine bump type for tag ${TAG}`);
      return;
  }
  core.notice(`Computed bump type for tag ${TAG} is ${bumpType}`);

  core.info('Setting up NPM auth...');
  await writeFile(
    path.resolve(WORKING_DIRECTORY, '.npmrc'),
    `//registry.npmjs.org/:_authToken=${NPM_TOKEN}`
  );

  core.info('Publishing NPM package...');
  const {stdout, stderr, exitCode} = await exec.getExecOutput(
    'npm',
    ['publish', '--tag', bumpType, '--access', 'public'],
    {silent: false, ignoreReturnCode: true, cwd: path.resolve(WORKING_DIRECTORY)}
  );

  if (exitCode === 0) {
    core.info('Published NPM package successfully!');
    return;
  }

  if (stderr.includes('You cannot publish over the previously published versions')) {
    core.warning('This version was already published.');
  } else if (stderr.includes('npm ERR!')) {
    core.setFailed(`Failed to publish NPM package: ${stderr}`);
  } else {
    core.setFailed(`Failed with unknown error: ${stderr}`);
  }
};

async function updatePackageJsonVersion(packageJsonPath, version) {
  const packageJsonContents = await readFile(packageJsonPath, {encoding: 'utf8'});
  const packageJson = JSON.parse(packageJsonContents);
  packageJson.version = `0.0.0-${version}`;
  return writeFile(packageJsonPath, JSON.stringify(packageJson));
}
