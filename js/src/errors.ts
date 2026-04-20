export const throwUnsupportedUnitError = (what: string, validUnits: string[]): never => {
  throw new Error(`Unsupported unit ${what}, use one of: ${validUnits.join(', ')}`);
};

export const throwUnsupportedCompatibilityError = (abbr: string, measure: string): never => {
  throw new Error(`Unsupported compatibility for unit ${abbr} and measure ${measure}`);
};

export const throwIncompatibleMeasuresError = (destMeasure: string, originMeasure: string): never => {
  throw new Error(`Cannot convert incompatible measures of ${destMeasure} and ${originMeasure}`);
};
