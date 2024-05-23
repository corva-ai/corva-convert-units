const convert = require('../index');

const MEASUREMENT_PRECISION = 10;

const conversionTable = [
  { from: 'strokes/min', amount: 1, to: 'strokes/sec', expected: 0.016666666666666666 },
  { from: 'strokes/min', amount: 1, to: 'strokes/h', expected: 60 },

  { from: 'strokes/sec', amount: 1, to: 'strokes/min', expected: 60 },
  { from: 'strokes/sec', amount: 1, to: 'strokes/h', expected: 3600 },

  { from: 'strokes/h', amount: 1, to: 'strokes/sec', expected: 0.0002777777777777778 },
  { from: 'strokes/h', amount: 1, to: 'strokes/min', expected: 0.016666666666666666 },
];

describe('strokesRate', () => {
  it('should be present in measures', () => {
    const measureList = convert().list('strokesRate');
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
