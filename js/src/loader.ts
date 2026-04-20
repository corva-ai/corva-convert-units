import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { MeasureDefinition, BucketMapping } from './types';

const UNIT_BUCKET_MAPPING_FILE = 'unitBucketMapping.json';
const DEFS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'definitions');

const loadDefinitions = (): Record<string, MeasureDefinition> => {
  const result: Record<string, MeasureDefinition> = {};
  const files = fs.readdirSync(DEFS_DIR).filter((f) => f.endsWith('.json') && f !== UNIT_BUCKET_MAPPING_FILE);

  for (const file of files) {
    const name = path.basename(file, '.json');
    const raw = JSON.parse(fs.readFileSync(path.join(DEFS_DIR, file), 'utf-8'));

    if (raw._anchors) {
      for (const key of Object.keys(raw._anchors)) {
        const anchor = raw._anchors[key];
        if (typeof anchor.transform === 'string') {
          anchor.transform = new Function('val', `return ${anchor.transform}`) as (val: number) => number;
        }
      }
    }

    result[name] = raw;
  }

  if (result.density) result.formationDensity = result.density;

  return result;
};

export const measures: Record<string, MeasureDefinition> = loadDefinitions();

export const bucketMapping: BucketMapping = JSON.parse(
  fs.readFileSync(path.join(DEFS_DIR, UNIT_BUCKET_MAPPING_FILE), 'utf-8'),
);
