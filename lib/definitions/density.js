var metric
  , imperial;

metric = {
  Sg: {
    name: {
      singular: 'Specific Gravity'
    , plural: 'Specific Gravity'
    , display: 'Sg'
    }
    , to_anchor: 1
  }
};

imperial = {
  ppg: {
    name: {
      singular: 'Pound Per Gallon'
    , plural: 'Pound Per Gallon'
    , display: 'ppg'
    }
    , to_anchor: 1
  }
};

module.exports = {
  metric: metric
  , imperial: imperial
  , _anchors: {
    metric: {
      unit: 'sg'
      , ratio: 0.1198264
    }
    , imperial: {
      unit: 'ppg'
      , ratio: 1/0.1198264
    }
  }
};
