var metric, imperial;

metric = {
  ohmm: {
    name: {
      singular: 'ohm-meter',
      plural: 'ohm-meter',
      display: 'ohmm'
    },
    to_anchor: 1,
    aliases: ['ohmm', 'ohm.m', 'ohm-'],
  },
};

imperial = {
  ohmm: {
    name: {
      singular: 'ohm-meter',
      plural: 'ohm-meter',
      display: 'ohmm'
    },
    to_anchor: 1,
    aliases: ['ohmm', 'ohm.m', 'ohm-'],
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'ohmm',
      ratio: 1,
    },
    imperial: {
      unit: 'ohmm',
      ratio: 1,
    },
  },
};
