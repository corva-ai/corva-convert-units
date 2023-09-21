const { g } = require("../constants");

var metric, imperial;

metric = {
  N: {
    name: {
      singular: 'Newton',
      plural: 'Newtons',
      display: 'N'
    },
    to_anchor: 1,
  },
  daN: {
    name: {
      singular: 'Dekanewton',
      plural: 'Dekanewtons',
      display: 'daN'
    },
    to_anchor: 10,
  },
  kdaN: {
    name: {
      singular: 'KiloDekanewton',
      plural: 'KiloDekanewtons',
      display: 'kdaN'
    },
    to_anchor: 10000,
  },
  TONNEf: {
    name: {
      singular: 'Ton Force (metric)',
      plural: 'Ton Force (metric)',
      display: 'TONNEf'
    },
    to_anchor: 1000 * g,
  },
};

imperial = {
  lbf: {
    name: {
      singular: 'Pound Force',
      plural: 'Pound Force',
      display: 'lbf'
    },
    to_anchor: 1,
  },
  klbf: {
    name: {
      singular: 'Kilopound Force',
      plural: 'Kilopound Force',
      display: 'klbf'
    },
    to_anchor: 1000,
  },
  'TONf US': {
    name: {
      singular: 'Ton Force (short)',
      plural: 'Ton Force (short)',
      display: 'TONf US'
    },
    to_anchor: 2000,
  },
  'TONf(long)': {
    name: {
      singular: 'Ton Force (long)',
      plural: 'Ton Force (long)',
      display: 'TONf(long)'
    },
    to_anchor: 2240,
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'N',
      ratio: 0.2248089431
    },
    imperial: {
      unit: 'lbf',
      ratio: 1 / 0.2248089431
    }
  }
};
