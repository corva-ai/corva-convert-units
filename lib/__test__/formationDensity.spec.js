const convert = require('../index');

// there is no need to do additional test because formationDensity just an alias for "density"
describe('formationDensity', () => {
  it('should be present in measures', () => {
    const measureList = convert().list('formationDensity');
    expect(measureList).not.toHaveLength(0);
  });

});
