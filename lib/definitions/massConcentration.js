var metric, imperial;

metric = {
  'kg/m3': {
    name: {
      singular: 'Kilogram per Cubic Meter',
      plural: 'Kilograms per Cubic Meter',
      display: 'kg/m³'
    },
    to_anchor: 1,
  },
};

imperial = {
  'lb/gal': {
    name: {
      singular: 'Pound Per Gallon',
      plural: 'Pounds Per Gallon',
      display: 'lb/gal'
    },
    to_anchor: 1
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'kg/m3',
      ratio: 0.0083,
    },
    imperial: {
      unit: 'lb/gal',
      ratio: 1/0.0083,
    }
  }
};
