const metric = {
  m: {
    name: {
      singular: "Meter",
      plural: "Meters",
      display: "m",
    },
    to_anchor: 1,
    aliases: ["m", "m.", "meter", "meters"],
  },
};

const imperial = {
  ft: {
    name: {
      singular: "Foot",
      plural: "Feet",
      display: "ft",
    },
    to_anchor: 1,
    aliases: ["f", "ft", `'`, "feet", "ftUS"],
  },
  usft: {
    name: {
      singular: "US Survey Foot",
      plural: "US Survey Feet",
      display: "usft",
    },
    to_anchor: 1.000002,
    aliases: ["usft", "usfeet"],
  },
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: "m",
      ratio: 3.28084,
    },
    imperial: {
      unit: "ft",
      ratio: 1 / 3.28084,
    },
  },
};
