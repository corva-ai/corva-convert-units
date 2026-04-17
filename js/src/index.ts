import { loadDefinitions, loadBucketMapping } from './loader.js';
import type {
  UnitDefinition,
  ResolvedUnit,
  ConversionResult,
  PlainUnit,
  BucketMapping,
} from './types.js';

export type {
  UnitDefinition,
  MeasureDefinition,
  SystemAnchor,
  ResolvedUnit,
  ConversionResult,
  PlainUnit,
  BucketMapping,
  UnitNames,
} from './types.js';

const measures = loadDefinitions();
const bucketMapping = loadBucketMapping();

let unitsByAlias: Record<string, string> | null = null;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function buildAliasMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const systems of Object.values(measures)) {
    for (const [system, units] of Object.entries(systems)) {
      if (system === '_anchors') continue;
      const unitMap = units as Record<string, UnitDefinition>;
      for (const [abbr, unit] of Object.entries(unitMap)) {
        for (const alias of unit.aliases ?? []) {
          map[alias] = abbr;
        }
        map[abbr] = abbr;
      }
    }
  }
  return map;
}

function resolveAbbrInMeasure(abbr: string, measureName: string): string {
  const systems = measures[measureName];
  if (!systems) return abbr;

  for (const system of Object.keys(systems)) {
    if (system === '_anchors') continue;
    const units = systems[system] as Record<string, UnitDefinition>;
    for (const [unitKey, unit] of Object.entries(units)) {
      if (unitKey === abbr) return abbr;
      for (const alias of unit.aliases ?? []) {
        if (alias === abbr) return unitKey;
      }
    }
  }

  return abbr;
}

function findUnitByKey(canonicalKey: string): ResolvedUnit | undefined {
  for (const [measureName, systems] of Object.entries(measures)) {
    for (const [system, units] of Object.entries(systems)) {
      if (system === '_anchors') continue;
      const unitMap = units as Record<string, UnitDefinition>;
      if (canonicalKey in unitMap) {
        return {
          abbr: canonicalKey,
          measure: measureName,
          system,
          unit: unitMap[canonicalKey],
        };
      }
    }
  }
  return undefined;
}

function getUnit(abbr: string, measure?: string): ResolvedUnit | undefined {
  if (measure) {
    const resolved = resolveAbbrInMeasure(abbr, measure);
    const systems = measures[measure];
    for (const [system, units] of Object.entries(systems)) {
      if (system === '_anchors') continue;
      const unitMap = units as Record<string, UnitDefinition>;
      if (resolved in unitMap) {
        return {
          abbr: resolved,
          measure,
          system,
          unit: unitMap[resolved],
        };
      }
    }
    throwUnsupportedCompatibilityError(abbr, measure);
  }

  let found = findUnitByKey(abbr);
  if (!found) {
    const resolvedGlobal = getUnitKeyByAlias(abbr);
    if (resolvedGlobal !== undefined) {
      found = findUnitByKey(resolvedGlobal);
    }
  }
  return found;
}

function getUnitForPair(
  abbrOne: string,
  abbrTwo: string,
): [ResolvedUnit, ResolvedUnit] | null {
  for (const [measure, systems] of Object.entries(measures)) {
    let foundOne: ResolvedUnit | undefined;
    let foundTwo: ResolvedUnit | undefined;

    for (const [system, units] of Object.entries(systems)) {
      if (system === '_anchors') continue;
      const unitMap = units as Record<string, UnitDefinition>;
      for (const [testAbbr, unit] of Object.entries(unitMap)) {
        if (testAbbr === abbrOne) {
          foundOne = { abbr: abbrOne, measure, system, unit };
        } else if (testAbbr === abbrTwo) {
          foundTwo = { abbr: abbrTwo, measure, system, unit };
        }
        if (foundOne && foundTwo) break;
      }
      if (foundOne && foundTwo) break;
    }

    if (foundOne && foundTwo) return [foundOne, foundTwo];
  }
  return null;
}

function toPlainUnit(resp: ResolvedUnit): PlainUnit {
  return {
    abbr: resp.abbr,
    measure: resp.measure,
    system: resp.system,
    singular: resp.unit.name.singular,
    plural: resp.unit.name.plural,
    display: resp.unit.name.display,
  };
}

function toPlainUnitWithAlias(resp: ResolvedUnit): PlainUnit {
  return {
    ...toPlainUnit(resp),
    aliases: resp.unit.aliases,
  };
}

function listUnits(
  measure: string | undefined,
  decorator: (r: ResolvedUnit) => PlainUnit,
): PlainUnit[] {
  const list: PlainUnit[] = [];
  for (const [testMeasure, systems] of Object.entries(measures)) {
    if (measure && measure !== testMeasure) continue;
    for (const [system, units] of Object.entries(systems)) {
      if (system === '_anchors') continue;
      const unitMap = units as Record<string, UnitDefinition>;
      for (const [abbr, unit] of Object.entries(unitMap)) {
        list.push(decorator({ abbr, measure: testMeasure, system, unit }));
      }
    }
  }
  return list;
}

function getPossibilities(
  measure?: string,
  origin?: ResolvedUnit,
): string[] {
  const possibilities: string[] = [];
  if (!origin && !measure) {
    for (const systems of Object.values(measures)) {
      for (const [system, units] of Object.entries(systems)) {
        if (system === '_anchors') continue;
        possibilities.push(
          ...Object.keys(units as Record<string, UnitDefinition>),
        );
      }
    }
  } else {
    const m = measure ?? origin!.measure;
    const systems = measures[m];
    for (const [system, units] of Object.entries(systems)) {
      if (system === '_anchors') continue;
      possibilities.push(
        ...Object.keys(units as Record<string, UnitDefinition>),
      );
    }
  }
  return possibilities;
}

function getMeasures(): string[] {
  return Object.keys(measures);
}

function getUnitKeyByAlias(alias: string): string | undefined {
  if (!unitsByAlias) {
    unitsByAlias = buildAliasMap();
  }
  return unitsByAlias[alias];
}

// ---------------------------------------------------------------------------
// Error helpers (return `never` so callers get proper narrowing)
// ---------------------------------------------------------------------------

function throwUnsupportedUnitError(what: string): never {
  const validUnits: string[] = [];
  for (const systems of Object.values(measures)) {
    for (const [system, units] of Object.entries(systems)) {
      if (system === '_anchors') continue;
      validUnits.push(
        ...Object.keys(units as Record<string, UnitDefinition>),
      );
    }
  }
  throw new Error(
    `Unsupported unit ${what}, use one of: ${validUnits.join(', ')}`,
  );
}

function throwUnsupportedMeasureError(what: string): never {
  throw new Error(
    `Unsupported measure ${what}, use one of: ${getMeasures()}`,
  );
}

function throwUnsupportedCompatibilityError(
  abbr: string,
  measure: string,
): never {
  throw new Error(
    `Unsupported compatibility for unit ${abbr} and measure ${measure}`,
  );
}

function throwIncompatibleMeasuresError(
  destMeasure: string,
  originMeasure: string,
): never {
  throw new Error(
    `Cannot convert incompatible measures of ${destMeasure} and ${originMeasure}`,
  );
}

// ---------------------------------------------------------------------------
// Converter class
// ---------------------------------------------------------------------------

export class Converter {
  private val: number;
  private measureName?: string;
  private origin?: ResolvedUnit;
  private destination?: ResolvedUnit;

  constructor(value: number, measure?: string) {
    this.val = value;
    this.measureName = measure;
    if (this.measureName && !getMeasures().includes(this.measureName)) {
      throwUnsupportedMeasureError(this.measureName);
    }
  }

  from(from: string): this {
    if (this.destination) {
      throw new Error('.from must be called before .to');
    }
    this.origin = getUnit(from, this.measureName);
    if (!this.origin) {
      throwUnsupportedUnitError(from);
    }
    return this;
  }

  to(to: string): number {
    if (!this.origin) {
      throw new Error('.to must be called after .from');
    }

    this.destination = getUnit(to, this.measureName);
    if (!this.destination) {
      throwUnsupportedUnitError(to);
    }

    if (this.origin.abbr === this.destination.abbr) {
      return this.val;
    }

    if (this.destination.measure !== this.origin.measure) {
      if (this.measureName) {
        throwIncompatibleMeasuresError(
          this.destination.measure,
          this.origin.measure,
        );
      }
      const pair = getUnitForPair(this.destination.abbr, this.origin.abbr);
      if (!pair) {
        throwIncompatibleMeasuresError(
          this.destination.measure,
          this.origin.measure,
        );
      }
      this.destination = pair[0];
      this.origin = pair[1];
    }

    let result = this.val * this.origin.unit.to_anchor;

    if (this.origin.unit.anchor_shift) {
      result -= this.origin.unit.anchor_shift;
    }

    if (this.origin.system !== this.destination.system) {
      const anchor =
        measures[this.origin.measure]._anchors[this.origin.system];
      if (typeof anchor.transform === 'function') {
        result = anchor.transform(result);
      } else {
        result *= anchor.ratio!;
      }
    }

    if (this.destination.unit.anchor_shift) {
      result += this.destination.unit.anchor_shift;
    }

    return result / this.destination.unit.to_anchor;
  }

  toBest(options?: { exclude?: string[] }): ConversionResult | undefined {
    if (!this.origin) {
      throw new Error('.toBest must be called after .from');
    }

    const exclude = options?.exclude ?? [];
    let best: ConversionResult | undefined;

    for (const possibility of this.possibilities()) {
      const unit = this.describe(possibility);
      if (!exclude.includes(possibility) && unit.system === this.origin.system) {
        const result = this.to(possibility);
        if (!best || (result >= 1 && result < best.val)) {
          best = {
            val: result,
            unit: possibility,
            singular: unit.singular,
            plural: unit.plural,
            display: unit.display,
          };
        }
      }
    }

    return best;
  }

  describe(abbr: string): PlainUnit {
    const resp = getUnit(abbr, this.measureName);
    if (!resp) {
      throwUnsupportedUnitError(abbr);
    }
    return toPlainUnit(resp);
  }

  list(measure?: string): PlainUnit[] {
    return listUnits(measure, toPlainUnit);
  }

  listWithAlias(measure?: string): PlainUnit[] {
    return listUnits(measure, toPlainUnitWithAlias);
  }

  possibilities(measure?: string): string[] {
    return getPossibilities(measure, this.origin);
  }

  measures(): string[] {
    return getMeasures();
  }

  getUnitBucketMapping(): BucketMapping {
    return bucketMapping;
  }

  getUnitKeyByAlias(alias: string): string | undefined {
    return getUnitKeyByAlias(alias);
  }
}

// ---------------------------------------------------------------------------
// `convert` factory function with static utility methods
// ---------------------------------------------------------------------------

interface ConvertFunction {
  (value: number): Converter;
  (value: number, measure: string): Converter;
  (value: number, from: string, to: string): number;
  (value: number, from: string, to: string, measure: string): number;

  measures(): string[];
  describe(abbr: string): PlainUnit;
  list(measure?: string): PlainUnit[];
  listWithAlias(measure?: string): PlainUnit[];
  possibilities(measure?: string): string[];
  bucketMapping(): BucketMapping;
  getUnitKeyByAlias(alias: string): string | undefined;
}

const convert: ConvertFunction = ((
  value: number,
  arg2?: string,
  arg3?: string,
  arg4?: string,
): Converter | number => {
  if (arg2 !== undefined && arg3 !== undefined) {
    return new Converter(value, arg4).from(arg2).to(arg3);
  }
  return new Converter(value, arg2);
}) as ConvertFunction;

convert.measures = getMeasures;

convert.describe = (abbr: string): PlainUnit => {
  const resp = getUnit(abbr);
  if (!resp) throwUnsupportedUnitError(abbr);
  return toPlainUnit(resp);
};

convert.list = (measure?: string) => listUnits(measure, toPlainUnit);

convert.listWithAlias = (measure?: string) =>
  listUnits(measure, toPlainUnitWithAlias);

convert.possibilities = (measure?: string) => getPossibilities(measure);

convert.bucketMapping = () => bucketMapping;

convert.getUnitKeyByAlias = getUnitKeyByAlias;

export default convert;
