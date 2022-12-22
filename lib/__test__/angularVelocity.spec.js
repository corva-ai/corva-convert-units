const convert = require('../index');

const MEASUREMENT_PRECISION = 10;

// test cases added prior merge of density with formationDensity
const conversionTable = [
  { from: 'rev/s', amount: 1, to: 'dega/s', expected: 360 },
  { from: '1/s', amount: 1, to: 'dega/s', expected: 360 },
  { from: 'rpm', amount: 1, to: 'dega/s', expected: 360 / 60 },
  { from: 'rpm', amount: 1, to: 'dega/m', expected: 360 },
  { from: 'rph', amount: 1, to: 'dega/m', expected: 6 },
  { from: 'rph', amount: 1, to: 'dega/s', expected: 0.1 },
  { from: 'rph', amount: 1, to: 'dega/h', expected: 360 },

  { from: 'dega/s', amount: 1, to: 'dega/s', expected: 1 },
  { from: 'dega/s', amount: 1, to: 'dega/m', expected: 60 },
  { from: 'dega/m', amount: 1, to: 'dega/s', expected: 1 / 60 },

  { from: '1/s', amount: 1, to: 'radsec', expected: 2 * Math.PI },
  { from: 'radsec', amount: 1, to: 'dega/s', expected: 180 / Math.PI },
  { from: 'dega/h', amount: 1, to: 'dega/s', expected: 1 / 3600 },
];

describe('angularVelocity', () => {
  it('should be present in measures', () => {
    const measureList = convert().list('angularVelocity');
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
