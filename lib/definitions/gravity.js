var metric, imperial;

metric = {
  'm/s2': {
    name: {
      singular: 'Meter per second squared',
      plural: 'Meters per second squared',
      display: 'm/s²'
    },
    to_anchor: 1,
    aliases: ['m/s2', 'm/s²']
  },
  'g': {
    name: {
      singular: 'Standard gravity',
      plural: 'Standard gravities',
      display: 'g'
    },
    to_anchor: 9.80665,
    aliases: ['g', 'gn']
  },
};

imperial = {
  'ft/s2': {
    name: {
      singular: 'Foot per second squared',
      plural: 'Feet per second squared',
      display: 'ft/s²'
    },
    to_anchor: 1,
    aliases: ['ft/s2', 'ft/s²']
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'm/s2',
      ratio: 3.28084 // 1 m/s² = 3.28084 ft/s²
    },
    imperial: {
      unit: 'ft/s2',
      ratio: 1 / 3.28084 // 1 ft/s² = 0.3048 m/s²
    }
  }
};
