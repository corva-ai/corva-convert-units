const angularVelocity = {
  radsec: {
    name: {
      singular: 'radsec',
      plural: 'radsec',
      display: 'radsec',
    },
    to_anchor: 9.549297,
  },
  rpm: {
    name: {
      singular: 'rpm',
      plural: 'rpm',
      display: 'rpm',
    },
    to_anchor: 1,
  }
};

module.exports = {
  metric: angularVelocity,
  imperial: angularVelocity,
  _anchors: {
    metric: {
      unit: 'rpm',
      ratio: 1,
    },
    imperial: {
      unit: 'rpm',
      ratio: 1,
    },
  },
};
