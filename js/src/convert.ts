import {
  bucketMapping,
  measures,
  aliasMap,
  getUnit,
  toPlainUnit,
  listUnits,
  getPossibilities,
  convertValue,
  toBest as toBestFn,
} from './core';
import { throwUnsupportedUnitError } from './errors';
import type { ConvertFn } from './types';

const convert: ConvertFn = ((value: number, from: string, to: string, measure?: string): number =>
  convertValue(value, from, to, measure)) as ConvertFn;

convert.measures = () => Object.keys(measures);
convert.describe = (abbr) => toPlainUnit(getUnit(abbr) ?? throwUnsupportedUnitError(abbr, getPossibilities()));
convert.list = (measure?) => listUnits(measure);
convert.listWithAlias = (measure?) => listUnits(measure, true);
convert.possibilities = (measure?) => getPossibilities(measure);
convert.toBest = (value, from, measure?, exclude?) => toBestFn(value, from, measure, exclude);
convert.bucketMapping = () => bucketMapping;
convert.getUnitKeyByAlias = (alias) => aliasMap.get(alias);

export default convert;
