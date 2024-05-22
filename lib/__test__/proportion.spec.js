const convert = require('../index');

const MEASUREMENT_PRECISION = 10;

const conversionTable = [
  { from: '%', amount: 1, to: 'Fraction', expected: 0.01 },
  { from: 'Fraction', amount: 1, to: '%', expected: 100 },
];

describe('proportion', () => {
  it('should be present in measures', () => {
    const measureList = convert().list('proportion');
    expect(measureList).not.toHaveLength(0);
  });

  describe('conversions', () => {
    for (let { from, to, amount, expected } of conversionTable) {
      it(`should correctly convert ${amount} "${from}" to "${to}"`, () => {
        expect(convert(amount).from(from).to(to)).toBeCloseTo(expected, MEASUREMENT_PRECISION);
      })
    }
  });
});
