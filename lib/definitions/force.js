var metric
  , imperial;

metric = {
  Nm: {
    name: {
      singular: 'Newton Meter'
      , plural: 'Newton Meters'
    }
    , to_anchor: 1
  }
  , J: {
    name: {
      singular: 'Joule'
      , plural: 'Joules'
    }
    , to_anchor: 1
  }
};

imperial = {
  lbf: {
    name: {
      singular: 'Pound Foot'
      , plural: 'Pound Feet'
    }
    , to_anchor: 1
  }
};

module.exports = {
  metric: metric
  , imperial: imperial
  , _anchors: {
    metric: {
      unit: 'nm'
      , ratio: 1.35581794833
    }
    , imperial: {
      unit: 'lbf'
      , ratio: 1/1.35581794833
    }
  }
};
