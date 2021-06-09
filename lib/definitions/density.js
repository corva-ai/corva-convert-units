const metric = {
  Sg: {
    name: {
      singular: 'Specific Gravity',
      plural: 'Specific Gravity',
      display: 'Sg'
    },
    to_anchor: 1
  },
  'kg/m3': {
    name: {
      singular: 'Kilogram per Cubic Meter',
      plural: 'Kilograms per Cubic Meter',
      display: 'kg/m³'
    },
    to_anchor: 1
  },
  'kg/cm3': {
    name: {
      singular: 'Kilogram per Cubic Centimeter',
      plural: 'Kilograms per Cubic Centimeter',
      display: 'kg/cm³'
    },
    to_anchor: 10**6
  },
  'g/m3': {
    name: {
      singular: 'Gram per Cubic Meter',
      plural: 'Grams per Cubic Meter',
      display: 'g/m³'
    },
    to_anchor: 1 / 1000
  },
  'g/cm3': {
    name: {
      singular: 'Gram per Cubic Centimeter',
      plural: 'Grams per Cubic Centimeter',
      display: 'g/cm³'
    },
    to_anchor: 1000
  },
  'g/l': {
    name: {
      singular: 'Gram per Litre',
      plural: 'Grams per Litre',
      display: 'g/cm³'
    },
    to_anchor: 1
  },
  'lb/in3': {
    name: {
      singular: 'Pound per Cubic Inch',
      plural: 'Pounds per Cubic Inch',
      display: 'lb/in³'
    },
    to_anchor: 27679.9
  },
  'lb/ft3': {
    name: {
      singular: 'Pound per Cubic Foot',
      plural: 'Pounds per Cubic Foot',
      display: 'lb/ft³'
    },
    to_anchor: 16.0185
  },
  'lb/gal': { // lb/gal is used for mass concentration
    name: {
      singular: 'Pound Per Gallon',
      plural: 'Pounds Per Gallon',
      display: 'lb/gal'
    },
    to_anchor: 119.826427
  },
  ppg: {
    name: {
      singular: 'Pound Per Gallon',
      plural: 'Pounds Per Gallon',
      display: 'ppg'
    },
    to_anchor: 119.826427
  },
  'lb/Mgal': {
    name: {
      singular: 'Pound per 1,000,000 Gallon',
      plural: 'Pounds per 1,000,000 Gallon',
      display: 'lb/Mgal'
    },
    to_anchor: 119.826427 / 10**6
  },
};

module.exports = {
  metric: metric,
  imperial: metric,
  _anchors: {
    metric: {
      unit: 'g/cm3',
      ratio: 1
    },
    imperial: {
      unit: 'g/cm3',
      ratio: 1
    }
  }
};
