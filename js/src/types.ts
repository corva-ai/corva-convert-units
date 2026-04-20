export type UnitNames = {
  singular: string;
  plural: string;
  display: string;
};

export type UnitDefinition = {
  name: UnitNames;
  to_anchor: number;
  anchor_shift?: number;
  aliases?: string[];
};

export type SystemAnchor = {
  unit: string;
  ratio?: number;
  transform?: (val: number) => number;
};

export type MeasureDefinition = {
  _anchors: Record<string, SystemAnchor>;
  [system: string]: Record<string, UnitDefinition> | Record<string, SystemAnchor>;
};

export type ResolvedUnit = {
  abbr: string;
  measure: string;
  system: string;
  unit: UnitDefinition;
};

export type ConversionResult = {
  val: number;
  unit: string;
  singular: string;
  plural: string;
  display: string;
};

export type PlainUnit = {
  abbr: string;
  measure: string;
  system: string;
  singular: string;
  plural: string;
  display: string;
  aliases?: string[];
};

export type BucketMapping = Record<string, string[]>;
