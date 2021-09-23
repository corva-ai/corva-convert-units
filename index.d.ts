declare function convert(value: unknown): convert.Converter;

declare namespace convert {
  export class Converter {
    constructor(numerator: number, denominator: number);
    val: number;
    from(from: string): this;
    to(to: string): number;
    toBest(options?: { exclude: string[] } | null): ConversionResult;
    measures(): string[];
    getUnit(abbr: string): Unit | undefined;
    getUnitForPair(abbrOne: string, abbrTwo: string): [Unit, Unit] | null;
    describe(abbr: string): PlainUnit;
    list(measure: string): PlainUnit[];
    throwUnsupportedUnitError(what: string): void;
    possibilities(measure: string): string[];
  }

  export type PlainUnit = UnitNames & Omit<Unit, "unit">;

  export type Unit = {
    abbr: string;
    measure: string;
    system: "metric" | "imperial";
    unit: UnitNames;
  };

  export type UnitNames = {
    singular: string;
    plural: string;
    display: string;
  };

  export type ConversionResult = {
    val: number;
    unit: string;
    singular: UnitNames["singular"];
    plural: UnitNames["plural"];
    display: UnitNames["display"];
  };
}

export = convert;
