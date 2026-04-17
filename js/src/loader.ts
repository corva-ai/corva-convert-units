import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { MeasureDefinition, BucketMapping } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_DEFS_DIR = path.resolve(__dirname, '..', 'definitions');

export function loadDefinitions(
  defsDir: string = DEFAULT_DEFS_DIR,
): Record<string, MeasureDefinition> {
  const measures: Record<string, MeasureDefinition> = {};
  const files = fs
    .readdirSync(defsDir)
    .filter((f) => f.endsWith('.json') && f !== 'unitBucketMapping.json');

  for (const file of files) {
    const name = path.basename(file, '.json');
    const raw = JSON.parse(fs.readFileSync(path.join(defsDir, file), 'utf-8'));

    if (raw._anchors) {
      for (const key of Object.keys(raw._anchors)) {
        const anchor = raw._anchors[key];
        if (typeof anchor.transform === 'string') {
          anchor.transform = new Function(
            'val',
            'return ' + anchor.transform,
          ) as (val: number) => number;
        }
      }
    }

    measures[name] = raw as MeasureDefinition;
  }

  if (measures.density) {
    measures.formationDensity = measures.density;
  }

  return measures;
}

export function loadBucketMapping(
  defsDir: string = DEFAULT_DEFS_DIR,
): BucketMapping {
  const filePath = path.join(defsDir, 'unitBucketMapping.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
