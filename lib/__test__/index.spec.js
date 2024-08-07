const convert = require('../index');

describe('index', () => {
  describe('should provide correct description of duplicated units', () => {
    it.each([
      { unit: '%', measure: undefined, expectedMeasure: 'gasConcentration' },
      { unit: '%', measure: 'gasConcentration', expectedMeasure: 'gasConcentration' },
      { unit: '%', measure: 'proportion', expectedMeasure: 'proportion' },
    ])('with unit: %s and measure: %s, expects measure: %s', ({ unit, measure, expectedMeasure }) => {
      const { measure: actualMeasure } = convert(undefined, measure).describe(unit);

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
      expect(() => convert(undefined, measure).describe(unit)).toThrowError(`Unsupported compatibility for unit ${unit} and measure ${measure}`);
    })
  })

  describe('should throw unsupported measure error', () => {
    it.each([
      { unit: '%', measure: 'anglee' },
      { unit: 'm3', measure: 'energyy' },
      { unit: 'km', measure: 'gravityy' },
      { unit: 'g', measure: 'lengthh' },
      { unit: 'watt', measure: 'forcee' },
    ])('with unit: %s and measure: %s, expects unsupported measure error', ({ unit, measure }) => {
      expect(() => convert(undefined, measure).describe(unit)).toThrowError(`Unsupported measure ${measure}, use one of: ${convert().measures()}`);
    })
  })

  describe('should throw incompatible measures error', () => {
    it.each([
      { sourceUnit: '%', targetUnit: 'm3' },
      { sourceUnit: 'm3', targetUnit: 'm' },
      { sourceUnit: 'km', targetUnit: '%' },
    ])('with source unit: %s and target unit: %s, expects incompatible measures error', ({ sourceUnit, targetUnit }) => {
      expect(() => convert().from(sourceUnit).to(targetUnit)).toThrowError(/Cannot convert incompatible measures of/);
    })
  })

  describe('should not throw incompatible measures error for unit pair from the same measure', () => {
    it.each([
      { sourceUnit: 'ppm', targetUnit: '%EMA' },
    ])('with source unit: %s and target unit: %s, expects valid convertation', ({ sourceUnit, targetUnit }) => {
      expect(() => convert().from(sourceUnit).to(targetUnit)).not.toThrowError(/Cannot convert incompatible measures of/);
    })
  });

  describe('should get unit name by alias', () => {
    it.each([
      { unit: 'mm', alias: 'mm' },
      { unit: 'lb/Mgal', alias: 'lbm/Mgal' },
      { unit: '32nd', alias: 'in/32' },
      { unit: 'in', alias: '"' },
      { unit: 'ft', alias: "'" },
    ])('get unit: %s by alias: %s', ({ unit, alias }) => {
      expect(convert().getUnitKeyByAlias(alias)).toBe(unit);
    });
  });

  describe('unit list test', () => {
    it('should get unit list without aliases', () => {
      const unitList = convert().list('mass');

      expect(unitList).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            aliases: expect.any(Array)
          })
        ])
      );
    });

    it('should get unit list without aliases', () => {
      const unitList = convert().listWithAlias('mass');

      expect(unitList).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            aliases: expect.any(Array)
          })
        ])
      );
    });
  });
});
