const metric = {
  '%EMA INT (10000Units)': {
    name: {
      singular: '%EMA International Unit',
      plural: '%EMA International Units',
      display: '%EMA International Units'
    },
    to_anchor: 100
  },
  '%EMA US (5000Units)': {
    name: {
      singular: '%EMA US Unit',
      plural: '%EMA US Units',
      display: '%EMA US Units'
    },
    to_anchor: 50
  },
  'Units': {
    name: {
      singular: 'Unit',
      plural: 'Units',
      display: 'Units'
    },
    to_anchor: 1
  },

};

module.exports = {
  metric: metric,
  imperial: metric,
  _anchors: {
    metric: {
      unit: 'Units',
      ratio: 1
    },
    imperial: {
      unit: 'Units',
      ratio: 1
    }
  }
};
