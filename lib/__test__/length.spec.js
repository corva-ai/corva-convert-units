const convert = require('../index');

const MEASUREMENT_PRECISION_AS_IS = 10;

const conversionTable = [
  { from: 'mpas', amount: 1, to: 'pas', expected: 0.001 },
  { from: 'pas', amount: 1, to: 'mpas', expected: 1000 },
];

describe('length measurement', () => {
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
