const metric = {
  '%': {
    name: {
      singular: '%',
      plural: '%',
      display: '%'
    },
    to_anchor: 1,
    aliases: [
      "%", 
      "percent",
      "flow_percent",
    ]
  },
  'Fraction': {
    name: {
      singular: 'Fraction',
      plural: 'Fraction',
      display: 'Fraction (0-1)'
    },
    to_anchor: 100,
    aliases: [
      "0-1"
    ]
  },
};

module.exports = {
  metric,
  imperial: metric,
  _anchors: {
    metric: {
      unit: '%',
      ratio: 1,
    },
    imperial: {
      unit: '%',
      ratio: 1,
    },
  }
};
