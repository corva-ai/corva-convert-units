const metric = {
  'API': {
    name: {
      singular: 'API Units',
      plural: 'API Units',
      display: 'API Units'
    },
    to_anchor: 1,
    aliases: [
      "API",
      "api",
      "api units"
    ]
  },
};

module.exports = {
  metric,
  imperial: metric,
  _anchors: {
    metric: {
      unit: 'API',
      ratio: 1,
    },
    imperial: {
      unit: 'API',
      ratio: 1,
    },
  }
};
