var metric, imperial;

metric = {
  'gRMS': {
    name: {
      singular: 'gravity gRMS',
      plural: 'gravity gRMS',
      display: 'gRMS'
    },
    to_anchor: 1,
    aliases: ['grms', 'Grms'],
  },
};

imperial = {
  'gRMS': {
    name: {
      singular: 'gravity gRMS',
      plural: 'gravity gRMS',
      display: 'gRMS'
    },
    to_anchor: 1,
    aliases: ['grms', 'Grms'],
  },
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'gRMS',
      ratio: 1
    },
    imperial: {
      unit: 'gRMS',
      ratio: 1
    }
  }
};
