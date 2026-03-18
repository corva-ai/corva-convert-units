export interface UnitNames {
  singular: string;
  plural: string;
  display: string;
}

export interface UnitDefinition {
  name: UnitNames;
  to_anchor: number;
  anchor_shift?: number;
  aliases?: string[];
}

export interface SystemAnchor {
  unit: string;
  ratio?: number;
  transform?: (val: number) => number;
}

export interface MeasureDefinition {
  _anchors: Record<string, SystemAnchor>;
  [system: string]: Record<string, UnitDefinition> | Record<string, SystemAnchor>;
}

export interface ResolvedUnit {
  abbr: string;
  measure: string;
  system: string;
  unit: UnitDefinition;
}

export interface ConversionResult {
  val: number;
  unit: string;
  singular: string;
  plural: string;
  display: string;
}

export interface PlainUnit {
  abbr: string;
  measure: string;
  system: string;
  singular: string;
  plural: string;
  display: string;
  aliases?: string[];
}

export type BucketMapping = Record<string, string[]>;
