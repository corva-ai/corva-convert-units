const convert = require('../index');

describe('index', () => {
  describe('should provide correct description of duplicated units', () => {
    it.each([
      { unit: '%', measure: undefined, expectedMeasure: 'gasConcentration' },
      { unit: '%', measure: 'gasConcentration', expectedMeasure: 'gasConcentration' },
      { unit: '%', measure: 'proportion', expectedMeasure: 'proportion' },
    ])('with unit: %s and measure: %s, expects measure: %s', ({ unit, measure, expectedMeasure }) => {
      const { measure: actualMeasure } = convert().describe(unit, measure);

      expect(actualMeasure).toContain(expectedMeasure);
    });
  });

  describe('should throw unsupported compatibility error', () => {
    it.each([
      { unit: '%', measure: 'angle' },
      { unit: 'm3', measure: 'energy' },
      { unit: 'km', measure: 'gravity' },
      { unit: 'g', measure: 'length' },
      { unit: 'watt', measure: 'force' },
    ])('with unit: %s and measure: %s, expects unsupported compatibility error', ({ unit, measure }) => {
      expect(() => convert().describe(unit, measure)).toThrowError(`Unsupported compatibility for unit ${unit} and measure ${measure}`);
    })
  })
});
