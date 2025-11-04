var metric, imperial;

metric = {
  mcg: {
    name: {
      singular: 'Microgram',
      plural: 'Micrograms',
      display: 'mcg'
    },
    to_anchor: 1 / 1000000,
    aliases: [
      "mcg"
    ]
  },
  mg: {
    name: {
      singular: 'Milligram',
      plural: 'Milligrams',
      display: 'mg'
    },
    to_anchor: 1 / 1000,
    aliases: [
      "mg"
    ]
  },
  g: {
    name: {
      singular: 'Gram',
      plural: 'Grams',
      display: 'g'
    },
    to_anchor: 1,
    aliases: [
      "g"
    ]
  },
  kg: {
    name: {
      singular: 'Kilogram',
      plural: 'Kilograms',
      display: 'kg'
    },
    to_anchor: 1000,
    aliases: [
      "kg"
    ]
  },
  ton: {
    name: {
      singular: 'Ton',
      plural: 'Tons',
      display: 't',
    },
    to_anchor: 1000 * 1000,
    aliases: [
      "ton"
    ]
  },
};

imperial = {
  oz: {
    name: {
      singular: 'Ounce',
      plural: 'Ounces',
      display: 'oz'
    },
    to_anchor: 1 / 16,
    aliases: [
      "oz"
    ]
  },
  sack: {
    name: {
      singular: 'Sack',
      plural: 'Sacks',
      display: 'sack'
    },
    to_anchor: 94,
    aliases: ['sack', 'sck'],
  },
  '100lb': {
    name: {
      singular: 'Hundred Pounds',
      plural: 'Hundreds of Pounds',
      display: '100lb'
    },
    to_anchor: 100,
    aliases: ['100lb'],
  },
  lb: {
    name: {
      singular: 'Pound',
      plural: 'Pounds',
      display: 'lb'
    },
    to_anchor: 1,
    aliases: [
      "lb",
      "lbs",
      "lbm"
    ]
  },
  klbs: {
    name: {
      singular: 'Kilopound',
      plural: 'Kilopounds',
      display: 'klbs'
    },
    to_anchor: 1000,
    aliases: [
      "klbs",
      "kLBS",
    ]
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'g',
      ratio: 1 / 453.592
    },
    imperial: {
      unit: 'lb',
      ratio: 453.592
    }
  }
};
