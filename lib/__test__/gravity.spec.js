const convert = require('../index');

const MEASUREMENT_PRECISION = 10;

const conversionTable = [
  { from: 'm/s2', amount: 1, to: 'ft/s2', expected: 3.28084 },
  { from: 'ft/s2', amount: 3.28084, to: 'm/s2', expected: 1 },
  { from: 'g', amount: 1, to: 'g', expected: 1 },
];


describe('gravity measurement', () => {

  it('should be present in measures', () => {
    const measureList = convert().list('gravity');
    expect(measureList).not.toHaveLength(0);
  });

  describe('conversions', () => {
    for (let { from, to, amount, expected } of conversionTable) {
      it(`should correctly convert ${amount} "${from}" to "${to}"`, () => {
        expect(convert(amount, 'gravity').from(from).to(to)).toBeCloseTo(expected, MEASUREMENT_PRECISION);
      })
    }
  });

});
