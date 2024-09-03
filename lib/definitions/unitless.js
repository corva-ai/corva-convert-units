const metric = {
  unitless: {
    name: {
      singular: 'unitless',
      plural: 'unitless',
      display: 'unitless'
    },
    to_anchor: 1,
    aliases: [
      'On/Off', 
      'None',
      'EUC',
      'Unitless'
    ]
  },
};

module.exports = {
  metric,
  imperial: metric,
  _anchors: {
    metric: {
      unit: 'unitless',
      ratio: 1,
    },
    imperial: {
      unit: 'unitless',
      ratio: 1,
    },
  }
};
