const convert = require('../index');

const MEASUREMENT_PRECISION_AS_IS = 10;
const MEASUREMENT_PRECISION = 4;

// test cases added prior merge of density with formationDensity
const conversionTableStable = [
  { from: 'Sg', amount: 1, to: 'Sg', expected: 1 },
  { from: 'Sg', amount: 1, to: 'kg/m3', expected: 1000 },
  { from: 'Sg', amount: 1, to: 'kg/cm3', expected: 0.001 },
  { from: 'Sg', amount: 1, to: 'lb/gal', expected: 8.345406354526215 },
  { from: 'Sg', amount: 1, to: 'ppg', expected: 8.345406354526215 },
  { from: 'Sg', amount: 1, to: 'lb/Mgal', expected: 8345.406354526214 },
  { from: 'ppg', amount: 1, to: 'Sg', expected: 0.1198264 },
  { from: 'ppg', amount: 1, to: 'kg/m3', expected: 119.8264 },
  { from: 'ppg', amount: 1, to: 'kg/cm3', expected: 0.0001198264 },
  { from: 'ppg', amount: 1, to: 'lb/gal', expected: 1 },
  { from: 'ppg', amount: 1, to: 'ppg', expected: 1 },
  // Sic! Mgal for some reason is 1000 gallons for 3 years
  // TODO: fix in density, as well as everywhere.
  // It might be not Mega but mili. Have to discuss with products.
  { from: 'ppg', amount: 1, to: 'lb/Mgal', expected: 1000 },
];

/**
 * Need to have same units as Formation Density:
 * Sg, kg/cm3, kg/m3, lb/Mgal, lb/gal, ppg, g/cm3, g/l, g/m3, kg/m3, lb/ft3, lb/in3
 * Converted used: https://www.digitaldutch.com/unitconverter/density.htm
 */
const conversionTable = [
  { from: 'Sg', amount: 1, to: 'g/cm3', expected: 1 },
  { from: 'Sg', amount: 1, to: 'g/l', expected: 1000 },
  { from: 'Sg', amount: 1, to: 'g/m3', expected: 1000000 },
  { from: 'Sg', amount: 1, to: 'lb/ft3', expected: 62.427962033 },
  { from: 'Sg', amount: 1, to: 'lb/in3', expected: 0.03612729292702749 },

  { from: 'ppg', amount: 1, to: 'g/cm3', expected: 0.119826427 },
  { from: 'ppg', amount: 1, to: 'g/l', expected: 119.826427 },
  { from: 'ppg', amount: 1, to: 'g/m3', expected: 119826.4 },
  { from: 'ppg', amount: 1, to: 'lb/ft3', expected: 7.48051963537325637 },
  { from: 'ppg', amount: 1, to: 'lb/in3', expected: 0.00432900442862808 },
];

describe('density measurement', () => {

  it('should be present in measures', () => {
    const measureList = convert().list('density');
    expect(measureList).not.toHaveLength(0);
  });

  // The following "describe" was added and tested prior merge of density with formationDensity
  describe('density conversions stabilization', () => {
    for (let { from, to, amount, expected } of conversionTableStable) {
      it(`The conversion from ${from} to ${to} should be correct`, () => {
        expect(convert(amount).from(from).to(to)).toBeCloseTo(expected, MEASUREMENT_PRECISION_AS_IS);
      })
    }
  });

  // used more lax precision here because for the existing cases the actual unmodified test
  // output was used as expected value
  describe('conversions', () => {
    for (let { from, to, amount, expected } of conversionTable) {
      it(`should correctly convert ${amount} "${from}" to "${to}"`, () => {
        expect(convert(amount).from(from).to(to)).toBeCloseTo(expected, MEASUREMENT_PRECISION);
      })
    }
  });

});
