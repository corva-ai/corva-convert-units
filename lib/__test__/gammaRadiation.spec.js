const convert = require('../index');

describe('gammaRadiation', () => {
  it('should be present in measures', () => {
    const measureList = convert().list('gammaRadiation');
    expect(measureList).not.toHaveLength(0);
  });
});
