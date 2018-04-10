var metric, imperial;

metric = {
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
    to_anchor: 1 / 1000
  },
  'kg/cm3': {
    name: {
      singular: 'Kilogram per Cubic Centimeter',
      plural: 'Kilograms per Cubic Centimeter',
      display: 'kg/cm³'
    },
    to_anchor: 1000
  }
};

imperial = {
  ppg: {
    name: {
      singular: 'Pound Per Gallon',
      plural: 'Pounds Per Gallon',
      display: 'ppg'
    },
    to_anchor: 1
  }
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
