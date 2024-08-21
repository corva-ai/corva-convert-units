const convert = require('../index');

const conversionTable = [
  { from: 'unitless', amount: 1, to: 'unitless', expected: 1 },
];

describe('unitless', () => {
  it('should be present in measures', () => {
    const measureList = convert().list('unitless');
    expect(measureList).not.toHaveLength(0);
  });

  describe('conversions', () => {
    for (let { from, to, amount, expected } of conversionTable) {
      it(`should correctly convert ${amount} "${from}" to "${to}"`, () => {
        expect(convert(amount, 'unitless').from(from).to(to)).toBe(expected);
      })
    }
  });
});
