declare function convert(value: unknown, measure?: string): convert.Converter;

declare namespace convert {
  export class Converter {
    constructor(numerator: number, measure?: string);
    val: number;
    measure: string | undefined;
    from(from: string): this;
    to(to: string): number;
    toBest(options?: { exclude: string[] } | null): ConversionResult;
    measures(): string[];
    getUnit(abbr: string, measure: string | undefined): Unit | undefined;
    describe(abbr: string): PlainUnit;
    list(measure: string | undefined): PlainUnit[];
    throwUnsupportedUnitError(what: string): void;
    throwUnsupportedMeasureError(what: string): void;
    throwUnsupportedCompatibilityError(abbr: Unit['abbr'], measure: string): void;
    possibilities(measure: string | undefined): string[];
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
