import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const defsDir = resolve(__dirname, '..', 'definitions');

const files = readdirSync(defsDir).filter(f => f.endsWith('.json') && f !== 'unitBucketMapping.json');
let totalUnits = 0;
let totalAliases = 0;
const issues = [];

for (const file of files) {
  const data = JSON.parse(readFileSync(join(defsDir, file), 'utf8'));
  const systems = Object.keys(data).filter(k => k !== '_anchors');

  if (!data._anchors) {
    issues.push(`${file}: missing _anchors`);
  }

  for (const sys of systems) {
    if (typeof data[sys] !== 'object') continue;

    for (const [key, unit] of Object.entries(data[sys])) {
      totalUnits++;

      if (!unit.name?.singular || !unit.name?.plural || !unit.name?.display) {
        issues.push(`${file}: ${key} missing or incomplete name`);
      }
      if (unit.to_anchor === undefined) {
        issues.push(`${file}: ${key} missing to_anchor`);
      }
      if (!Array.isArray(unit.aliases) || unit.aliases.length === 0) {
        issues.push(`${file}: ${key} missing or empty aliases`);
      } else if (!unit.aliases.includes(key)) {
        issues.push(`${file}: ${key} aliases don't include unit key`);
      }

      totalAliases += unit.aliases?.length ?? 0;
    }
  }
}

console.log(`Files: ${files.length}`);
console.log(`Total units: ${totalUnits}`);
console.log(`Total aliases: ${totalAliases}`);

if (issues.length > 0) {
  console.error(`\nIssues (${issues.length}):`);
  for (const issue of issues) {
    console.error(`  - ${issue}`);
  }
  process.exit(1);
} else {
  console.log('All definitions valid.');
}
