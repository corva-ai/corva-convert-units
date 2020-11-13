declare module "corva-convert-units" {
  interface Anchor {
    unit: string;
    ratio?: number;
    transform?: (input: number) => number;
  }

  interface Measures {
    [key: string]: {
      metric: {
        [key: string]: Measure;
      };
      imperial: {
        [key: string]: Measure;
      };
      _anchors: {
        metric: Anchor;
        imperial: Anchor;
      };
    };
  }

  interface Measure {
    name: UnitName;
    to_anchor: number;
    anchor_shift?: number;
  }

  interface UnitName {
    singular: string;
    plural: string;
    display?: string;
  }

  interface Match extends UnitName {
    val: number;
    unit: Description;
  }

  interface ToBestOptions {
    exclude: string[];
  }

  interface ResolvedUnit {
    abbr: string;
    measure: string;
    system: string;
    unit: UnitName;
  }

  interface Description extends UnitName {
    abbr: string;
    measure: Measure;
    system: string;
  }

  class Converter {
    private val: number;
    private origin: ResolvedUnit;
    private destination: ResolvedUnit;

    constructor(numerator: number, denominator?: number);

    from(from: string): this;
    to(to: string): number;
    toBest(options: ToBestOptions | null): Match;
    getUnit(abbr: string): ResolvedUnit | false;
    describe(abbr: string): Description;
    list(measure: string): Description[];
    private throwUnsupportedUnitError(what: string): void;
    possibilities(measure?: string): string[];
    measures(): string[];
  }

  function convert(numerator: number, denominator?: number): Converter;

  export = convert;
}
