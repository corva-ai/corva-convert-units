const convert = require('../index');
const resistivity = require('../definitions/resistivity');

describe('resistivity definitions', () => {
  it('exports metric and imperial ohmm with same anchor scale', () => {
    expect(resistivity.metric).toBeDefined();
    expect(resistivity.imperial).toBeDefined();
    expect(resistivity.metric.ohmm).toMatchObject({
      to_anchor: 1,
      aliases: expect.arrayContaining(['ohmm', 'ohm.m', 'ohm-']),
    });
    expect(resistivity.imperial.ohmm).toMatchObject({
      to_anchor: 1,
      aliases: expect.arrayContaining(['ohmm', 'ohm.m', 'ohm-']),
    });
  });

  it('exports _anchors with unit ohmm and ratio 1', () => {
    expect(resistivity._anchors.metric.unit).toBe('ohmm');
    expect(resistivity._anchors.imperial.unit).toBe('ohmm');
    expect(resistivity._anchors.metric.ratio).toBe(1);
    expect(resistivity._anchors.imperial.ratio).toBe(1);
  });
});

describe('resistivity measurement conversions', () => {
  it.each([
    { from: 'ohmm', to: 'ohmm', amount: 42, expected: 42 },
    { from: 'ohm.m', to: 'ohmm', amount: 10, expected: 10 },
    { from: 'ohm-', to: 'ohmm', amount: 3.5, expected: 3.5 },
    { from: 'ohmm', to: 'ohm.m', amount: 7, expected: 7 },
  ])('converts $amount $from to $expected $to', ({ from, to, amount, expected }) => {
    expect(convert(amount).from(from).to(to)).toBeCloseTo(expected, 10);
  });

  it('resolves aliases when measure is resistivity', () => {
    expect(convert(2, 'resistivity').from('ohm.m').to('ohmm')).toBe(2);
    expect(convert(2, 'resistivity').from('ohm-').to('ohmm')).toBe(2);
  });
});
