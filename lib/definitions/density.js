const { g } = require("../constants");

const metric = {
  /**
   * Specific gravity is the ratio of a material's density with that of water at 4 °C
   * (where it is most dense and is taken to have the value 999.974 kg m-3)
   * Used as 1 here
   */
  Sg: {
    name: {
      singular: 'Specific Gravity',
      plural: 'Specific Gravity',
      display: 'Sg'
    },
    to_anchor: 1,
    aliases: ['Sg'],
  },
  'kg/m3': {
    name: {
      singular: 'Kilogram per Cubic Meter',
      plural: 'Kilograms per Cubic Meter',
      display: 'kg/m³',
    },
    to_anchor: 1 / 1000,
    aliases: ['kg/m3'],
  },
  'kg/cm3': {
    name: {
      singular: 'Kilogram per Cubic Centimeter',
      plural: 'Kilograms per Cubic Centimeter',
      display: 'kg/cm³'
    },
    to_anchor: 1000,
    aliases: ['kg/cm3'],
  },
  'g/cm3': {
    name: {
      singular: 'Gram per Cubic Centimeter',
      plural: 'Grams per Cubic Centimeter',
      display: 'g/cm³'
    },
    to_anchor: 1,
    aliases: ['g/c3', 'g/cc', 'g/cm3'],
  },
  'g/l': {
    name: {
      singular: 'Gram per Liter',
      plural: 'Grams per Liter',
      display: 'g/l'
    },
    to_anchor: 1 / 1000,
    aliases: ['g/l'],
  },
  'g/m3': {
    name: {
      singular: 'Gram per Cubic Meter',
      plural: 'Grams per Cubic Meter',
      display: 'g/m3'
    },
    to_anchor: 1 / 1000000,
    aliases: ['gm/3', 'gm/c'],
  },
  'kPa/m': {
    name: {
      singular: 'Kilopascal per Meter',
      plural: 'Kilopascals per Meter',
      display: 'kPa/m'
    },
    to_anchor: 1 / g,
    aliases: ['kPa/m'],
  },
  'mg/l': {
    name: {
      singular: 'Milligram per Liter',
      plural: 'Milligrams per Liter',
      display: 'mg/l'
    },
    to_anchor: 1 / 1000000,
    aliases: ['mg/l', 'mg/L'],
  },
};

const imperial = {
  'lb/gal': { // lb/gal is used for mass concentration
    name: {
      singular: 'Pound Per Gallon',
      plural: 'Pounds Per Gallon',
      display: 'lb/gal'
    },
    to_anchor: 1,
    aliases: ['lb/gal', 'lbm/gal', 'lbm/galUS', 'lbs/galUS'],
  },
  /**
   * https://glossary.slb.com/en/terms/p/ppg
   * lbm/galUS
   * Abbreviation for density, pounds per gallon, more correctly written lbm/galUS.
   * For example, the density of water is 8.33 ppg at 60 degF [16 degC].
   * The "US" is included to differentiate between US gallons and UK gallons.
   */
  ppg: {
    name: {
      singular: 'Pound Per Gallon',
      plural: 'Pounds Per Gallon',
      display: 'ppg'
    },
    to_anchor: 1,
    aliases: ['ppg'],
  },
  'lb/bbl': {
    name: {
      singular: 'Pound Per Barrel',
      plural: 'Pounds Per Barrel',
      display: 'lb/bbl'
    },
    to_anchor: 1 / 42,
    aliases: ['lb/bbl', 'lbm/bbl'],
  },
  'lb/Mgal': {
    name: {
      singular: 'Pound per 1000 Gallon',
      plural: 'Pounds per 1000 Gallon',
      display: 'lb/Mgal'
    },
    to_anchor: 1 / 1000,
    aliases: ['lb/Mgal', 'lbm/Mgal'],
  },
  'lb/ft3': {
    name: {
      singular: 'Pound per Cubic Foot',
      plural: 'Pounds per Cubic Foot',
      display: 'lb/ft³'
    },
    // Gallon in liters / Cubic Foot in liters
    to_anchor: 3.785411784 / 28.316846592,
    aliases: ['lb/ft3'],
  },
  'lb/in3': {
    name: {
      singular: 'Pound per Cubic Inch',
      plural: 'Pounds per Cubic Inch',
      display: 'lb/in³'
    },
    // Gallon in liters / Cubic inch in liters
    to_anchor: 3.785411784 / 0.0163870640,
    aliases: ['lb/in3'],
  },
  /**
   * In the drilling industry, especially in the context of wellbore hydraulics and
   * formation pressures, the unit "psi/ft" represents "pounds per square inch per foot."
   * It is often used to describe the pressure gradient or the equivalent mud weight (EMW)
   * in a wellbore. This pressure gradient helps in determining the pressure at any given
   * depth in a well.
   *
   * For example, a formation with a pressure gradient of 0.5 psi/ft at a depth of 2,000
   * feet would have a pressure of 0.5 × 2,000 = 1,000 psi.
   *
   * However, it's important to note that "psi/ft" itself is not a traditional "name" or
   * "title" of a unit like "pascal" or "atmosphere." Instead, it's more of a description
   * of how the unit is derived (pressure per unit depth). In various drilling contexts,
   * it might just be referred to as the "pressure gradient."
   */
  'psi/ft': {
    name: {
      singular: 'Pound per square inch per foot',
      plural: 'Pounds per square inch per foot',
      display: 'psi/ft'
    },
    to_anchor: 19.25,
    aliases: ['psi/ft'],
  },
  'psi/1000ft': {
    name: {
      singular: 'Pound per square inch per 1000 ft',
      plural: 'Pounds per square inch per 1000 ft',
      display: 'psi/1000ft'
    },
    to_anchor: 0.01925,
    aliases: ['psi/1000ft'],
  },
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'Sg',
      ratio: 1 / 0.1198264
    },
    imperial: {
      unit: 'ppg',
      ratio: 0.1198264
    }
  }
};
