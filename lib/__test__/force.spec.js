const convert = require('../index');

const MEASUREMENT_PRECISION_AS_IS = 10;

const conversionTable = [
  // Stabilization tests
  { from: 'daN', amount: 1, to: 'N', expected: 10 },
  { from: 'kdaN', amount: 1, to: 'N', expected: 10000 },
  { from: 'daN', amount: 1, to: 'lbf', expected: 2.248089431 },

  // New tonne force units
  { from: 'TONNEf', amount: 1, to: 'N', expected: 9806.65 },
  { from: 'TONNEf', amount: 1, to: 'klbf', expected: 2.2046226219, precision: 6},

  { from: 'TONf US', amount: 1, to: 'klbf', expected: 2, precision: 6 },
  { from: 'TONf US', amount: 1, to: 'lbf', expected: 2000, precision: 6 },
  { from: 'TONf(long)', amount: 1, to: 'klbf', expected: 2.24, precision: 6 },

  { from: 'TONf(long)', amount: 1, to: 'TONf US', expected: 1.12 },

  // cross system check
  { from: 'TONf US', amount: 1, to: 'N', expected: 8896.44323, precision: 4 },
  { from: 'TONNEf', amount: 453.6, to: 'TONf US', expected: 500, precision: 0 },
];


describe('force measurement', () => {
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
