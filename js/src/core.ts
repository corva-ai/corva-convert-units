import { measures, bucketMapping } from './loader';
import {
  throwUnsupportedCompatibilityError,
  throwUnsupportedUnitError,
  throwIncompatibleMeasuresError,
} from './errors';
import type { UnitDefinition, ResolvedUnit, PlainUnit, ConversionResult } from './types';

const unitIndex = new Map<string, ResolvedUnit>();
const measureIndex = new Map<string, ResolvedUnit[]>();
const aliasMap = new Map<string, string>();

const _buildIndexes = (): ResolvedUnit[] => {
  const all: ResolvedUnit[] = [];

  for (const [measure, systems] of Object.entries(measures)) {
    for (const [system, units] of Object.entries(systems)) {
      if (system === '_anchors') continue;
      for (const [abbr, unit] of Object.entries(units as Record<string, UnitDefinition>)) {
        const entry: ResolvedUnit = { abbr, unit, system, measure };
        all.push(entry);

        // First occurrence wins (preserves density over formationDensity for global lookups).
        if (!unitIndex.has(abbr)) unitIndex.set(abbr, entry);

        if (!measureIndex.has(measure)) measureIndex.set(measure, []);
        measureIndex.get(measure)!.push(entry);

        aliasMap.set(abbr, abbr);
        for (const alias of unit.aliases ?? []) aliasMap.set(alias, abbr);
      }
    }
  }

  return all;
};

const allUnits = _buildIndexes();

// Lookup helpers
const getUnit = (abbr: string, measure?: string): ResolvedUnit | undefined => {
  if (measure) {
    const entry = measureIndex.get(measure)?.find((e) => e.abbr === abbr || e.unit.aliases?.includes(abbr));
    if (!entry) throwUnsupportedCompatibilityError(abbr, measure);
    return entry;
  }
  const canonical = aliasMap.get(abbr);
  return canonical !== undefined ? unitIndex.get(canonical) : undefined;
};

const _getUnitForPair = (abbrOne: string, abbrTwo: string): [ResolvedUnit, ResolvedUnit] | null => {
  const one = unitIndex.get(abbrOne);
  const two = unitIndex.get(abbrTwo);
  return one && two && one.measure === two.measure ? [one, two] : null;
};

const toPlainUnit = ({ abbr, measure, system, unit }: ResolvedUnit): PlainUnit => ({
  abbr,
  measure,
  system,
  singular: unit.name.singular,
  plural: unit.name.plural,
  display: unit.name.display,
});

const _toPlainUnitWithAlias = (entry: ResolvedUnit): PlainUnit => ({
  ...toPlainUnit(entry),
  aliases: entry.unit.aliases,
});

const listUnits = (measure?: string, withAliases = false): PlainUnit[] => {
  const decorator = withAliases ? _toPlainUnitWithAlias : toPlainUnit;
  const entries = measure ? (measureIndex.get(measure) ?? []) : allUnits;
  return entries.map(decorator);
};

const getPossibilities = (measure?: string, origin?: ResolvedUnit): string[] => {
  const m = measure ?? origin?.measure;
  if (!m) return [...unitIndex.keys()];
  return (measureIndex.get(m) ?? []).map((e) => e.abbr);
};

const convertValue = (value: number, from: string, to: string, measure?: string): number => {
  const origin = getUnit(from, measure) ?? throwUnsupportedUnitError(from, getPossibilities());
  const dest = getUnit(to, measure) ?? throwUnsupportedUnitError(to, getPossibilities());

  if (origin.abbr === dest.abbr) return value;

  let src = origin;
  let tgt = dest;

  if (dest.measure !== origin.measure) {
    if (measure) throwIncompatibleMeasuresError(dest.measure, origin.measure);
    [tgt, src] =
      _getUnitForPair(dest.abbr, origin.abbr) ?? throwIncompatibleMeasuresError(dest.measure, origin.measure);
  }

  let result = value * src.unit.to_anchor;
  if (src.unit.anchor_shift) result -= src.unit.anchor_shift;

  if (src.system !== tgt.system) {
    const anchor = measures[src.measure]._anchors[src.system];
    result = typeof anchor.transform === 'function' ? anchor.transform(result) : result * anchor.ratio!;
  }

  if (tgt.unit.anchor_shift) result += tgt.unit.anchor_shift;
  return result / tgt.unit.to_anchor;
};

const toBest = (
  value: number,
  from: string,
  measure?: string,
  exclude: string[] = [],
): ConversionResult | undefined => {
  const origin = getUnit(from, measure);
  if (!origin) return undefined;

  let best: ConversionResult | undefined;

  for (const abbr of getPossibilities(origin.measure)) {
    if (exclude.includes(abbr)) continue;
    const entry = measureIndex.get(origin.measure)?.find((e) => e.abbr === abbr);
    if (!entry || entry.system !== origin.system) continue;

    const result = convertValue(value, from, abbr, origin.measure);
    const { singular, plural, display } = toPlainUnit(entry);
    if (!best || (result >= 1 && result < best.val)) {
      best = { val: result, unit: abbr, singular, plural, display };
    }
  }

  return best;
};

export { measures, bucketMapping, aliasMap, getUnit, toPlainUnit, listUnits, getPossibilities, convertValue, toBest };
