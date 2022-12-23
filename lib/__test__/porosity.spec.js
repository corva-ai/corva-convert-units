const convert = require('../index');

const MEASUREMENT_PRECISION = 10;

const conversionTable = [
  { from: 'v/v', amount: 1, to: 'pu', expected: 100 },
  { from: 'pu', amount: 50, to: 'v/v', expected: 0.5 },
  { from: 'v/v', amount: 1, to: 'v/v', expected: 1 },
];

describe('porosity', () => {
  it('should be present in measures', () => {
    const measureList = convert().list('porosity');
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
