const convert = require('../index');

const MEASUREMENT_PRECISION = 10;

const conversionTable = [
  // Added prior changes
  { from: '%EMA', amount: 1, to: 'Units (0-5000u)', expected: 50 },
  { from: '%EMA', amount: 100, to: 'Units (0-5000u)', expected: 5000 },
  { from: '%EMA', amount: 100, to: 'Units (0-10000u)', expected: 10000 },
  { from: 'Units (0-10000u)', amount: 100, to: 'Units (0-5000u)', expected: 50 },

  // added units
  { from: '%EMA', amount: 1, to: 'ppm', expected: 10000 },
  { from: '%', amount: 1, to: '%EMA', expected: 1 },
  { from: '%', amount: 1, to: 'Units', expected: 50 },
  { from: 'Units', amount: 50, to: '%EMA', expected: 1 },
];

describe('gasConcentration', () => {
  it('should be present in measures', () => {
    const measureList = convert().list('porosity');
    expect(measureList).not.toHaveLength(0);
  });

  describe('conversions', () => {
    for (let { from, to, amount, expected } of conversionTable) {
      it(`should correctly convert ${amount} "${from}" to "${to}"`, () => {
        expect(convert(amount, 'gasConcentration').from(from).to(to)).toBeCloseTo(expected, MEASUREMENT_PRECISION);
      })
    }
  });
});
