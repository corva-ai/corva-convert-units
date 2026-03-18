const convert = require('../index');
const pressure = require('../definitions/pressure');

const PRECISION = 10;

const conversionTable = [
  { from: 'kPa', amount: 100, to: 'bar', expected: 1 },
  { from: 'bar', amount: 1, to: 'kPa', expected: 100 },
  { from: 'MPa', amount: 1, to: 'kPa', expected: 1000 },
  { from: 'kPa', amount: 1000, to: 'MPa', expected: 1 },
  { from: 'Pa', amount: 1000, to: 'kPa', expected: 1 },
  { from: 'kPa', amount: 1, to: 'Pa', expected: 1000 },
  { from: 'hPa', amount: 10, to: 'kPa', expected: 1 },
  { from: 'psi', amount: 1000, to: 'ksi', expected: 1 },
  { from: 'ksi', amount: 1, to: 'psi', expected: 1000 },
  { from: 'kpsi', amount: 1, to: 'psi', expected: 1000 },
  { from: 'psi', amount: 1000, to: 'kpsi', expected: 1 },
  { from: 'ksi', amount: 1, to: 'kpsi', expected: 1 },
  { from: 'kpsi', amount: 2, to: 'ksi', expected: 2 },
  { from: 'kPa', amount: 100, to: 'psi', expected: 14.503768077999999, precision: 5 },
  { from: 'psi', amount: 14.5038, to: 'kPa', expected: 100, precision: 0 },
  { from: 'psf', amount: 144, to: 'psi', expected: 1 },
  { from: 'psi', amount: 1, to: 'psf', expected: 144 },
  { from: 'torr', amount: 760, to: 'kPa', expected: 101.325, precision: 5 },
  { from: 'psiAdjusted', amount: 1, to: 'psi', expected: 0.35 },
  { from: 'kPaAdjusted', amount: 1, to: 'kPa', expected: 0.35 },
  { from: 'ksiAdjusted', amount: 1, to: 'ksi', expected: 0.35 },
  { from: 'dsf', amount: 10, to: 'psf', expected: 1 },
];

describe('pressure definitions', () => {
  it('exports metric and imperial unit maps', () => {
    expect(pressure.metric).toBeDefined();
    expect(pressure.imperial).toBeDefined();
    expect(pressure.metric.kPa).toMatchObject({ to_anchor: 1 });
    expect(pressure.imperial.psi).toMatchObject({ to_anchor: 1 / 1000 });
    expect(pressure.imperial.ksi.to_anchor).toBe(1);
  });

  it('exports _anchors linking metric kPa and imperial ksi', () => {
    expect(pressure._anchors.metric.unit).toBe('kPa');
    expect(pressure._anchors.imperial.unit).toBe('ksi');
    expect(pressure._anchors.metric.ratio).toBeCloseTo(0.00014503768078, 12);
    expect(pressure._anchors.imperial.ratio).toBeCloseTo(1 / 0.00014503768078, 6);
  });
});

describe('pressure measurement conversions', () => {
  for (const row of conversionTable) {
    const { from, to, amount, expected, precision = PRECISION } = row;
    it(`converts ${amount} ${from} to ~${expected} ${to}`, () => {
      expect(convert(amount).from(from).to(to)).toBeCloseTo(expected, precision);
    });
  }
});
