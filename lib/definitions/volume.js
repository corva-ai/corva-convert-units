var metric, imperial;

metric = {
  mm3: {
    name: {
      singular: 'Cubic Millimeter',
      plural: 'Cubic Millimeters',
      display: 'mm³'
    },
    to_anchor: 1 / 1000000,
    aliases: [
      "mm3"
    ]
  },
  cm3: {
    name: {
      singular: 'Cubic Centimeter',
      plural: 'Cubic Centimeters',
      display: 'cm³'
    },
    to_anchor: 1 / 1000,
    aliases: [
      "cm3"
    ]
  },
  ml: {
    name: {
      singular: 'Millilitre',
      plural: 'Millilitres',
      display: 'ml'
    },
    to_anchor: 1 / 1000,
    aliases: [
      "ml",
      "mL",
      "ml of",
      "mL of",
    ]
  },
  cl: {
    name: {
      singular: 'Centilitre',
      plural: 'Centilitres',
      display: 'cl'
    },
    to_anchor: 1 / 100,
    aliases: [
      "cl"
    ]
  },
  dl: {
    name: {
      singular: 'Decilitre',
      plural: 'Decilitres',
      display: 'dl'
    },
    to_anchor: 1 / 10,
    aliases: [
      "dl"
    ]
  },
  l: {
    name: {
      singular: 'Litre',
      plural: 'Litres',
      display: 'l'
    },
    to_anchor: 1,
    aliases: [
      "l"
    ]
  },
  m3: {
    name: {
      singular: 'Cubic meter',
      plural: 'Cubic meters',
      display: 'm³'
    },
    to_anchor: 1000,
    aliases: [
      "m3"
    ]
  },
  km3: {
    name: {
      singular: 'Cubic kilometer',
      plural: 'Cubic kilometers',
      display: 'km³'
    },
    to_anchor: 1000000000000,
    aliases: [
      "km3"
    ]
  }

  // Swedish units
  ,
  krm: {
    name: {
      singular: 'Matsked',
      plural: 'Matskedar',
      display: 'krm'
    },
    to_anchor: 1 / 1000,
    aliases: [
      "krm"
    ]
  },
  tsk: {
    name: {
      singular: 'Tesked',
      plural: 'Teskedar',
      display: 'tsk'
    },
    to_anchor: 5 / 1000,
    aliases: [
      "tsk"
    ]
  },
  msk: {
    name: {
      singular: 'Matsked',
      plural: 'Matskedar',
      display: 'msk'
    },
    to_anchor: 15 / 1000,
    aliases: [
      "msk"
    ]
  },
  kkp: {
    name: {
      singular: 'Kaffekopp',
      plural: 'Kaffekoppar',
      display: 'kkp'
    },
    to_anchor: 150 / 1000,
    aliases: [
      "kkp"
    ]
  },
  glas: {
    name: {
      singular: 'Glas',
      plural: 'Glas',
      display: 'glas'
    },
    to_anchor: 200 / 1000,
    aliases: [
      "glas"
    ]
  },
  kanna: {
    name: {
      singular: 'Kanna',
      plural: 'Kannor',
      display: 'kanna'
    },
    to_anchor: 2.617,
    aliases: [
      "kanna"
    ]
  }
};

imperial = {
  tsp: {
    name: {
      singular: 'Teaspoon',
      plural: 'Teaspoons',
      display: 'tsp'
    },
    to_anchor: 1 / 6,
    aliases: [
      "tsp"
    ]
  },
  Tbs: {
    name: {
      singular: 'Tablespoon',
      plural: 'Tablespoons',
      display: 'tbsp'
    },
    to_anchor: 1 / 2,
    aliases: [
      "Tbs"
    ]
  },
  in3: {
    name: {
      singular: 'Cubic inch',
      plural: 'Cubic inches',
      display: 'in³'
    },
    to_anchor: 0.55411,
    aliases: [
      "in3"
    ]
  },
  'fl-oz': {
    name: {
      singular: 'Fluid Ounce',
      plural: 'Fluid Ounces',
      display: 'fl-oz'
    },
    to_anchor: 1,
    aliases: [
      "fl-oz"
    ]
  },
  cup: {
    name: {
      singular: 'Cup',
      plural: 'Cups',
      display: 'cup'
    },
    to_anchor: 8,
    aliases: [
      "cup"
    ]
  },
  pnt: {
    name: {
      singular: 'Pint',
      plural: 'Pints',
      display: 'pint'
    },
    to_anchor: 16,
    aliases: [
      "pnt"
    ]
  },
  qt: {
    name: {
      singular: 'Quart',
      plural: 'Quarts',
      display: 'qt'
    },
    to_anchor: 32,
    aliases: [
      "qt"
    ]
  },
  gal: {
    name: {
      singular: 'Gallon',
      plural: 'Gallons',
      display: 'gal'
    },
    to_anchor: 128,
    aliases: [
      "gal",
      "gals",
    ]
  },
  ft3: {
    name: {
      singular: 'Cubic foot',
      plural: 'Cubic feet',
      display: 'ft³'
    },
    to_anchor: 957.506,
    aliases: [
      "ft3"
    ]
  },
  yd3: {
    name: {
      singular: 'Cubic yard',
      plural: 'Cubic yards',
      display: 'yd³'
    },
    to_anchor: 25852.7,
    aliases: [
      "yd3"
    ]
  },
  bbl: {
    name: {
      singular: 'Oil barrel',
      plural: 'Oil barrels',
      display: 'bbl'
    },
    to_anchor: 5376,
    aliases: [
      "bbl",
      "bbls",
      "barrels"
    ]
  }
};

module.exports = {
  metric: metric,
  imperial: imperial,
  _anchors: {
    metric: {
      unit: 'l',
      ratio: 33.8140226
    },
    imperial: {
      unit: 'fl-oz',
      ratio: 1 / 33.8140226
    }
  }
};
