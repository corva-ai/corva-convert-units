var metric, imperial;

metric = {
  N: {
    name: {
      singular: 'Newton',
      plural: 'Newtons',
      display: 'N'
    },
    to_anchor: 1
  },
  daN: {
    name: {
      singular: 'Dekanewton',
      plural: 'Dekanewtons',
      display: 'daN'
    },
    to_anchor: 10
  }
};

imperial = {
  lbf: {
    name: {
      singular: 'Pound Force',
      plural: 'Pound Force',
      display: 'lbf'
    },
    to_anchor: 1
  },
  klbf: {
    name: {
      singular: 'Kilopound Force',
      plural: 'Kilopound Force',
      display: 'klbf'
    },
    to_anchor: 1000
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'N',
      ratio: 1
    },
    imperial: {
      unit: 'lbf',
      ratio: 1/0.2248089431
    }
  }
};
