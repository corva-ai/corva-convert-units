const convert = require('../index');

const MEASUREMENT_PRECISION_AS_IS = 10;

const conversionTable = [
  { from: 'nV', amount: 1, to: 'mV', expected: 0.000001 },
  { from: 'V', amount: 1, to: 'nV', expected: 1000000000 },
];

describe('voltage measurement', () => {
  it('should be present in measures', () => {
    const measureList = convert().list('density');
    expect(measureList).not.toHaveLength(0);
  });

  for (let { from, to, amount, expected, precision = MEASUREMENT_PRECISION_AS_IS } of conversionTable) {
    it(`should convert ${amount} ${from} to ${Number(expected.toFixed(precision))} ${to}`, () => {
      expect(convert(amount).from(from).to(to)).toBeCloseTo(expected, precision);
    })
  }
});
