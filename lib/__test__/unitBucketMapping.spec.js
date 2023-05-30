const convert = require('../index');

describe('unitBucketMapping', () => {
  it('should be present in measures', () => {
    const unitBucketMapping = convert().getUnitBucketMapping();

    expect(unitBucketMapping.BUCKETS).toBeTruthy();
    expect(unitBucketMapping.BUCKET_MAP).toBeTruthy();
  });
});
