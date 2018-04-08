var metric, imperial;

metric = {
  'dpm': {
    name: {
      singular: 'degree per meter',
      plural: 'degrees per meter',
      display: '°/m'
    },
    to_anchor: 1,
  },
  'dp30m': {
    name: {
      singular: 'degree per 30m',
      plural: 'degrees per 30m',
      display: '°/30m'
    },
    to_anchor: 1/30,
  }
};

imperial = {
  'dpf': {
    name: {
      singular: 'degree per foot',
      plural: 'degrees per feet',
      display: '°/ft'
    },
    to_anchor: 1
  },
  'dp100f': {
    name: {
      singular: 'degree per 100 foot',
      plural: 'degrees per 100 feet',
      display: '°/100ft'
    },
    to_anchor: 1/100
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'dpm',
      ratio: 3.281,
    },
    imperial: {
      unit: 'dpf',
      ratio: 1/3.281,
    }
  }
};
