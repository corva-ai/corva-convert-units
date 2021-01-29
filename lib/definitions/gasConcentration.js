const metric = {
  'International Units': {
    name: {
      singular: 'International Unit',
      plural: 'International Units',
      display: 'International Units'
    },
    to_anchor: 1 / 100
  },
  'US Units': {
    name: {
      singular: 'US Unit',
      plural: 'US Units',
      display: 'US Units'
    },
    to_anchor: 1 / 50
  },
  '% EMA': {
    name: {
      singular: '% EMA',
      plural: '% EMA',
      display: '% EMA'
    },
    to_anchor: 1
  },

};

module.exports = {
  metric: metric,
  imperial: metric,
  _anchors: {
    metric: {
      unit: '% EMA',
      ratio: 1
    },
    imperial: {
      unit: '% EMA',
      ratio: 1
    }
  }
};
