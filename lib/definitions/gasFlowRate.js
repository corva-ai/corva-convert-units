var metric, imperial;

metric = {
  "m3/day": {
    name: {
      singular: "Cubic meter per day",
      plural: "Cubic meters per day",
      display: "m³/day",
    },
    to_anchor: 1,
  },
};

imperial = {
  "Mscf/day": {
    name: {
      singular: "Thousand standard cubic foot per day",
      plural: "Thousand standard cubic feet per day",
      display: "Mscf/day",
    },
    to_anchor: 1,
  },
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: "m3/day",
      ratio: 0.035314666721488586,
    },
    imperial: {
      unit: "Mscf/day",
      ratio: 28.316846592,
    },
  },
};
