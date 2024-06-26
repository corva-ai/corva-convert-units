const { getAliases, reverseObject } = require('../helpers');
const angle =  require('./angle');
const anglePerLength =  require('./anglePerLength');
const angularVelocity =  require('./angularVelocity');
const area =  require('./area');
const current =  require('./current');
const force =  require('./force');
const lengthPerAngle =  require('./lengthPerAngle');
const mass =  require('./mass');
const massFlowRate = require('./massFlowRate');
const volumeFlowRate = require('./volumeFlowRate');
const power = require('./power');
const inversePressure = require('./inversePressure');
const pressureGradient = require('./pressureGradient');
const revolutionPerVolume = require('./revolutionPerVolume');
const time = require('./time');
const density = require('./density');
const length = require('./length');
const pressure = require('./pressure');
const concentration = require('./concentration');
const voltage = require('./voltage');
const volumeConcentration = require('./volumeConcentration');
const resistivity = require('./resistivity');
const porosity = require('./porosity');
const permiability = require('./permiability');
const acousticSlowness = require('./acousticSlowness');
const temperature = require('./temperature');
const speed = require('./speed');
const volume = require('./volume');
const mpl = require('./mpl');
const energy = require('./energy');
const strokesRate = require('./strokesRate')
const proportion = require('./proportion');
const gammaRadiation = require('./gammaRadiation');

const BUCKETS = {
    'Angle': [...getAliases(angle.metric)],
    'Angle Per Length': [...getAliases(anglePerLength.metric), ...getAliases(anglePerLength.imperial)],
    'Angular Velocity': [...getAliases(angularVelocity.metric)],
    'Area': [...getAliases(area.metric), ...getAliases(area.imperial)],
    'Current': [...getAliases(current.metric)],
    'Force': [...getAliases(force.metric), ...getAliases(force.imperial)],
    'Length Per Angle': [...getAliases(lengthPerAngle.metric), ...getAliases(lengthPerAngle.imperial)],
    'Mass': [...getAliases(mass.metric), ...getAliases(mass.imperial)],
    'Mass Flow Rate': [...getAliases(massFlowRate.metric), ...getAliases(massFlowRate.imperial)],
    'Mass per length': [...getAliases(mpl.metric), ...getAliases(mpl.imperial)],
    'Volume Flow Rate': [...getAliases(volumeFlowRate.metric), ...getAliases(volumeFlowRate.imperial)],
    'Power': [...getAliases(power.metric), ...getAliases(power.imperial)],
    'Inverse Pressure': [...getAliases(inversePressure.metric), ...getAliases(inversePressure.imperial)],
    'Pressure Gradient': [...getAliases(pressureGradient.metric), ...getAliases(pressureGradient.imperial)],
    'Proportion': [...getAliases(proportion.metric)],
    'Revolution Per Volume': [...getAliases(revolutionPerVolume.metric), ...getAliases(revolutionPerVolume.imperial)],
    'Time': [...getAliases(time.metric)],
    'Torque': [...getAliases(energy.metric), ...getAliases(energy.imperial)],
    'Voltage': [...getAliases(voltage.metric)],
    'Volume Concentration': [...getAliases(volumeConcentration.metric), ...getAliases(volumeConcentration.imperial)],
    'Length': [...getAliases(length.metric, ['mm', 'cm']), ...getAliases(length.imperial, ['in'])],
    'Resistivity': [...getAliases(resistivity.imperial)],
    'Formation Density': [...density.metric['g/cm3'].aliases],
    'Density': [...getAliases(density.metric, ['g/cm3']), ...getAliases(density.imperial)],
    'Porosity': [...getAliases(porosity.metric)],
    'Permiability': [...getAliases(permiability.metric)],
    'Acoustic Slowness': [...getAliases(acousticSlowness.metric), ...getAliases(acousticSlowness.imperial)],
    'Temperature': [...getAliases(temperature.metric), ...getAliases(temperature.imperial)],
    'Short Length': [...length.imperial['in'].aliases, ...length.metric.mm.aliases, ...length.metric.cm.aliases],
    'Strokes Rate': [...getAliases(strokesRate.metric)],
    'Concentration': [...getAliases(concentration.metric)],
    'Velocity': [...getAliases(speed.metric), ...getAliases(speed.imperial)],
    'Volume': [...getAliases(volume.metric), ...getAliases(volume.imperial)],
    'Mse Pressure': [...pressure.metric.kPa.aliases, ...pressure.imperial.ksi.aliases],
    'Pressure': [...getAliases(pressure.metric,['kPa']), ...getAliases(pressure.imperial, ['ksi'])],
    'Gamma Radiation': [...getAliases(gammaRadiation.metric)],
    'Other': ['*'],
};

module.exports = {
    BUCKETS,
    BUCKET_MAP: reverseObject(BUCKETS),
};
