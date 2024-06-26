const convert = require('../index');

const MEASUREMENT_PRECISION_AS_IS = 10;

const conversionTable = [
  { from: 'mlmin', amount: 1, to: 'ml', expected: 0.0005555555555555556 },
  { from: 'in3', amount: 1, to: 'mlmin', expected: 29496.579327417854 },
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
