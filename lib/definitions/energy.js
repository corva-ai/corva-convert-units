var metric, imperial;

metric = {
  Nm: {
    name: {
      singular: 'Newton Meter',
      plural: 'Newton Meters',
      display: 'Nm'
    },
    to_anchor: 1
  },
  J: {
    name: {
      singular: 'Joule',
      plural: 'Joules',
      display: 'J'
    },
    to_anchor: 1
  }
};

imperial = {
  'ft-lb': {
    name: {
      singular: 'Pound Foot',
      plural: 'Pound Feet',
      display: 'ft-lb'
    },
    to_anchor: 1
  },
  'kft-lb': {
    name: {
      singular: 'Kilo-Pound Foot',
      plural: 'Kilo-Pound Feet',
      display: 'kft-lb'
    },
    to_anchor: 1/1000
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'nm',
      ratio: 1.35581794833
    },
    imperial: {
      unit: 'ft-lb',
      ratio: 1 / 1.35581794833
    }
  }
};
