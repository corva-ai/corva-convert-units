const convert = require('../index');

const sackConversionTable = [
  { from: 'lb', input: 1, to: 'sack', output: 94 },
  { from: 'lb', input: 2, to: 'sack', output: 188 },

  { from: 'sack', input: 94, to: 'lb', output: 1 },
  { from: 'sack', input: 188, to: 'lb', output: 2 },
];

const _100lbConversionTable = [
  { from: 'lb', input: 100, to: '100lb', output: 1 },
  { from: 'lb', input: 200, to: '100lb', output: 2 },

  { from: '100lb', input: 1, to: 'lb', output: 100 },
  { from: '100lb', input: 2, to: 'lb', output: 200 },
];

describe('Mass', () => {
  it('should be present in measures', () => {
    const measureList = convert().list('mass');
    expect(measureList).not.toHaveLength(0);
  });

  describe('sack', () => {
      test.each(sackConversionTable)(`should convert $input $from to $output $to`, ({input, from, to, output}) => {
        expect(convert(input).from(from).to(to)).toBe(output);
      });
  });

  describe('100lb', () => {
      test.each(_100lbConversionTable)(`should convert $input $from to $output $to`, ({input, from, to, output}) => {
        expect(convert(input).from(from).to(to)).toBe(output);
      });
  });
});
