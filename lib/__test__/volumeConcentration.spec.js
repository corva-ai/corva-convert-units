const convert = require('../index');


const galMgalConversionTable = [
  { from: 'l/m3', input: 1, to: 'gal/Mgal', output: 0.00378541 * 1 },
  { from: 'l/m3', input: 264.172, to: 'gal/Mgal', output: 0.00378541 * 264.172 },

  { from: 'gal/Mgal', input: 1, to: 'l/m3', output: 1 / 0.00378541 },
  { from: 'gal/Mgal', input: 0.00378541, to: 'l/m3', output: (1 / 0.00378541) * 0.00378541 },
];

describe('Volume Concentration', () => {
  it('should be present in measures', () => {
    const measureList = convert().list('volumeConcentration');
    expect(measureList).not.toHaveLength(0);
  });

  describe('gal/Mgal', () => {
    test.each(galMgalConversionTable)(
        `should convert $input $from to $output $to`,
        ({ input, from, to, output }) => {
          expect(convert(input).from(from).to(to)).toBe(output);
        }
    );
  });
});
