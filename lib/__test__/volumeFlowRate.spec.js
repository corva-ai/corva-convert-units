const convert = require('../index');

const MEASUREMENT_PRECISION_AS_IS = 10;

const conversionTable = [
  { from: 'ml/30min', amount: 1, to: 'cm3/s', expected: 0.0005555555555555556 },
  { from: 'fl-oz/h', amount: 1, to: 'ml/30min', expected: 14.786764782055938 },
];

describe('volume measurement', () => {
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
