const unitBucketMapping = require('./definitions/unitBucketMapping');
var convert, keys = require('lodash.keys'),
  each = require('lodash.foreach'),
  measures = {
    length: require('./definitions/length'),
    area: require('./definitions/area'),
    mass: require('./definitions/mass'),
    volume: require('./definitions/volume'),
    each: require('./definitions/each'),
    temperature: require('./definitions/temperature'),
    time: require('./definitions/time'),
    digital: require('./definitions/digital'),
    partsPer: require('./definitions/partsPer'),
    speed: require('./definitions/speed'),
    pressure: require('./definitions/pressure'),
    inversePressure: require('./definitions/inversePressure'),
    pressureGradient: require('./definitions/pressureGradient'),
    energy: require('./definitions/energy'),
    force: require('./definitions/force'),
    density: require('./definitions/density'),
    mpl: require('./definitions/mpl'),
    volumeFlowRate: require('./definitions/volumeFlowRate'),
    angle: require('./definitions/angle'),
    anglePerLength: require('./definitions/anglePerLength'),
    angularVelocity: require('./definitions/angularVelocity'),
    lengthPerAngle: require('./definitions/lengthPerAngle'),
    revolutionPerVolume: require('./definitions/revolutionPerVolume'),
    massFlowRate: require('./definitions/massFlowRate'),
    power: require('./definitions/power'),
    volumeConcentration: require('./definitions/volumeConcentration'),
    current: require('./definitions/current'),
    voltage: require('./definitions/voltage'),
    resistivity: require('./definitions/resistivity'),
    porosity: require('./definitions/porosity'),
    permiability: require('./definitions/permiability'),
    acousticSlowness: require('./definitions/acousticSlowness'),
    spontaneousPotential: require('./definitions/spontaneousPotential'),
    concentration: require('./definitions/concentration'),
    // Duplicate of density. Probably can be removed
    formationDensity: require('./definitions/density'),
    gasConcentration: require('./definitions/gasConcentration'),
    gasVolume: require('./definitions/gasVolume'),
    gasFlowRate: require("./definitions/gasFlowRate"),
    gravity:  require('./definitions/gravity'),
    gravityRMS:  require('./definitions/gravityRMS'),
    proportion: require('./definitions/proportion'),
    strokesRate: require('./definitions/strokesRate'),
    viscosity: require('./definitions/viscosity'),
    gammaRadiation: require('./definitions/gammaRadiation'),
    unitless: require('./definitions/unitless')
  },
  Converter;

let unitsByAlias;

Converter = function(numerator, measure) {
  this.unitBucketMapping = unitBucketMapping;
  this.measure = measure;

  if (this.measure) {
    const isMeasureValid = this.measures().includes(this.measure);

    if (!isMeasureValid) {
      this.throwUnsupportedMeasureError(this.measure);
    }
  }

  this.val = numerator;
};

/**
 * Lets the converter know the source unit abbreviation
 * @param {string} from
 * @returns {Converter}
 */
Converter.prototype.from = function(from) {
  if (this.destination)
    throw new Error('.from must be called before .to');

  this.origin = this.getUnit(from, this.measure);

  if (!this.origin) {
    this.throwUnsupportedUnitError(from);
  }

  return this;
};

/**
 * Converts the unit and returns the value
 */
Converter.prototype.to = function(to) {
  if (!this.origin)
    throw new Error('.to must be called after .from');

  this.destination = this.getUnit(to, this.measure);

  var result, transform;

  if (!this.destination) {
    this.throwUnsupportedUnitError(to);
  }

  // Don't change the value if origin and destination are the same
  if (this.origin.abbr === this.destination.abbr) {
    return this.val;
  }

  // You can't go from liquid to mass, for example
  if (this.destination.measure != this.origin.measure) {
    if (this.measure) {
      this.throwIncompatibleMeasuresError(this.destination.measure, this.origin.measure);
    }

    const pair = this.getUnitForPair(this.destination.abbr, this.origin.abbr);

    if (!pair) {
      this.throwIncompatibleMeasuresError(this.destination.measure, this.origin.measure);
    }

    this.destination = pair[0];
    this.origin = pair[1];
  }

  /**
   * Convert from the source value to its anchor inside the system
   */
  result = this.val * this.origin.unit.to_anchor;

  /**
   * For some changes it's a simple shift (C to K)
   * So we'll add it when convering into the unit
   * and substract it when converting from the unit
   */
  if (this.destination.unit.anchor_shift) {
    result += this.destination.unit.anchor_shift;
  }

  if (this.origin.unit.anchor_shift) {
    result -= this.origin.unit.anchor_shift
  }

  /**
   * Convert from one system to another through the anchor ratio. Some conversions
   * aren't ratio based or require more than a simple shift. We can provide a custom
   * transform here to provide the direct result
   */
  if (this.origin.system != this.destination.system) {
    transform = measures[this.origin.measure]._anchors[this.origin.system].transform;
    if (typeof transform === 'function') {
      return result = transform(result)
    }
    result *= measures[this.origin.measure]._anchors[this.origin.system].ratio;
  }

  /**
   * Convert to another unit inside the destination system
   */
  return result / this.destination.unit.to_anchor;
};

/**
 * Converts the unit to the best available unit.
 */
Converter.prototype.toBest = function(options) {
  if (!this.origin)
    throw new Error('.toBest must be called after .from');

  if (options == null) {
    options = {
      exclude: []
    };
  }

  var best;
  /**
   Looks through every possibility for the 'best' available unit.
   i.e. Where the value has the fewest numbers before the decimal point,
   but is still higher than 1.
   */
  each(this.possibilities(), function(possibility) {
    var unit = this.describe(possibility);
    var isIncluded = options.exclude.indexOf(possibility) === -1;

    if (isIncluded && unit.system === this.origin.system) {
      var result = this.to(possibility);
      if (!best || (result >= 1 && result < best.val)) {
        best = {
          val: result,
          unit: possibility,
          singular: unit.singular,
          plural: unit.plural,
          display: unit.display
        };
      }
    }
  }.bind(this));

  return best;
};

/**
 * Finds the unit
 */
Converter.prototype.getUnit = function(abbr, measure) {
  var found;

  if (measure) {
    const systems = measures[measure];

    each(systems, function(units, system) {
      if (system === '_anchors')
        return false;

      each(units, function(unit, testAbbr) {
        if (testAbbr === abbr) {
          found = {
            abbr: abbr,
            measure: measure,
            system: system,
            unit: unit
          };
          return false;
        }
      });

      if (found)
        return false;
    });

    if (!found) {
      this.throwUnsupportedCompatibilityError(abbr, measure);
    }

    return found;
  }

  // if measure is not provided, it will try to find the first matching one from the whole measures list
  each(measures, function(systems, measure) {
    each(systems, function(units, system) {
      if (system === '_anchors')
        return false;

      each(units, function(unit, testAbbr) {
        if (testAbbr === abbr) {
          found = {
            abbr: abbr,
            measure: measure,
            system: system,
            unit: unit
          };
          return false;
        }
      });

      if (found)
        return false;
    });

    if (found)
      return false;
  });

  return found;
};

Converter.prototype.getUnitForPair = function(abbrOne, abbrTwo) {
  var foundOne;
  var foundTwo;

  each(measures, function(systems, measure) {
    each(systems, function(units, system) {
      if (system === '_anchors')
        return false;

      each(units, function(unit, testAbbr) {
        if (testAbbr === abbrOne) {
          foundOne = {
            abbr: abbrOne,
            measure: measure,
            system: system,
            unit: unit
          };
        } else if (testAbbr === abbrTwo) {
          foundTwo = {
            abbr: abbrTwo,
            measure: measure,
            system: system,
            unit: unit
          };
        }

        if (foundOne && foundTwo) {
          return false;
        }
      });

      if (foundOne && foundTwo) {
        return false;
      }
    });

    if (foundOne && foundTwo) {
      return false;
    } else {
      foundOne = null;
      foundTwo = null;
    }
  });

  return foundOne && foundTwo ? [foundOne, foundTwo] : null;
};

var describe = function(resp) {
  return {
    abbr: resp.abbr,
    measure: resp.measure,
    system: resp.system,
    singular: resp.unit.name.singular,
    plural: resp.unit.name.plural,
    display: resp.unit.name.display
  };
};

/**
 * An alias for getUnit
 */
Converter.prototype.describe = function(abbr) {
  var resp = Converter.prototype.getUnit(abbr, this.measure);

  return describe(resp);
};

const describeWithAlias = function(resp) {
  return {
    abbr: resp.abbr,
    measure: resp.measure,
    system: resp.system,
    singular: resp.unit.name.singular,
    plural: resp.unit.name.plural,
    display: resp.unit.name.display,
    aliases: resp.unit.aliases,
  };
};

const unitList = function(measure, unitDecorator) {
  var list = [];

  each(measures, function(systems, testMeasure) {
    if (measure && measure !== testMeasure)
      return;

    each(systems, function(units, system) {
      if (system == '_anchors')
        return false;

      each(units, function(unit, abbr) {
        list = list.concat(unitDecorator({
          abbr: abbr,
          measure: testMeasure,
          system: system,
          unit: unit
        }));
      });
    });
  });

  return list;
}

/**
 * Detailed list of all supported units
 * @param {string} [measure]
 */
Converter.prototype.list = function(measure) {
  return unitList(measure, describe);
};

/**
 * Detailed list of all supported units with aliases
 * @param {string} [measure]
 */
Converter.prototype.listWithAlias = function(measure) {
  return unitList(measure, describeWithAlias);
};

Converter.prototype.throwUnsupportedUnitError = function(what) {
  var validUnits = [];

  each(measures, function(systems) {
    each(systems, function(units, system) {
      if (system == '_anchors')
        return false;

      validUnits = validUnits.concat(keys(units));
    });
  });

  throw new Error('Unsupported unit ' + what + ', use one of: ' + validUnits.join(', '));
};

Converter.prototype.throwUnsupportedMeasureError = function(what) {
  throw new Error('Unsupported measure ' + what + ', use one of: ' + this.measures());
};

Converter.prototype.throwUnsupportedCompatibilityError = function(abbr, measure) {
  throw new Error('Unsupported compatibility for unit ' + abbr + ' and measure ' + measure);
};

Converter.prototype.throwIncompatibleMeasuresError = function(destinationMeasure, originMeasure) {
  throw new Error('Cannot convert incompatible measures of ' + destinationMeasure + ' and ' + originMeasure);
};

/**
 * Returns the abbreviated measures that the value can be
 * converted to.
 */
Converter.prototype.possibilities = function(measure) {
  var possibilities = [];
  if (!this.origin && !measure) {
    each(keys(measures), function(measure) {
      each(measures[measure], function(units, system) {
        if (system == '_anchors')
          return false;

        possibilities = possibilities.concat(keys(units));
      });
    });
  } else {
    measure = measure || this.origin.measure;
    each(measures[measure], function(units, system) {
      if (system == '_anchors')
        return false;

      possibilities = possibilities.concat(keys(units));
    });
  }

  return possibilities;
};

/**
 * Returns the abbreviated measures that the value can be
 * converted to.
 */
Converter.prototype.measures = function() {
  return keys(measures);
};

Converter.prototype.getUnitBucketMapping = function() {
  return this.unitBucketMapping;
};

Converter.prototype.getUnitKeyByAlias = function(alias) {
  if (!unitsByAlias) {
    unitsByAlias = Object.values(measures).reduce((measureRes, systems) => {
      const systemAliases = Object.entries(systems).reduce((systemRes, [system, units]) => {
        if (system == '_anchors') return systemRes;

        const unitAliases = Object.entries(units).reduce((unitRes, [abbr, unit]) => {
          for (const alias of unit.aliases || []) {
            unitRes[alias] = abbr;
          }

          unitRes[abbr] = abbr;

          return unitRes;
        }, {});

        return { ...systemRes, ...unitAliases };
      }, {});
      return { ...measureRes, ...systemAliases};
    }, {});
  }

  return unitsByAlias[alias];
}

convert = function(value, measure = undefined) {
  return new Converter(value, measure);
};

module.exports = convert;
