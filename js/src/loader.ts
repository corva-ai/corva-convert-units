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

  // Restore the same lookup priority as the original library.
  //
  // Measures listed here are moved to the END of the insertion order so that
  // "first occurrence wins" in buildIndexes() resolves shared unit keys correctly:
  //
  //   density / formationDensity — share kPa/m and psi/ft with pressureGradient;
  //                                pressureGradient anchors must win
  //   concentration              — shares ppm with partsPer; partsPer must win
  //   gasConcentration           — shares ppm with partsPer; partsPer must win
  //   force / gravity            — share g with mass; mass (gram) must win
  //   gasVolume                  — shares gal/bbl/m3 with volume; liquid anchors must win
  //   spontaneousPotential       — shares mV with voltage; voltage must win
  const DEPRIORITIZED = [
    'density',
    'formationDensity',
    'concentration',
    'gasConcentration',
    'force',
    'gravity',
    'gasVolume',
    'spontaneousPotential',
  ];
  const deprioritized: Record<string, MeasureDefinition> = {};
  for (const key of DEPRIORITIZED) {
    if (result[key]) {
      deprioritized[key] = result[key];
      delete result[key];
    }
  }
  return { ...result, ...deprioritized };
};

export const measures: Record<string, MeasureDefinition> = loadDefinitions();

export const bucketMapping: BucketMapping = JSON.parse(
  fs.readFileSync(path.join(DEFS_DIR, UNIT_BUCKET_MAPPING_FILE), 'utf-8'),
);
