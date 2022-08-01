var convert = require('../index');

const MSCF_VALUE = 5.5;
const MSCF_TO_M3 = 155.8073654390935;
const MSCF_TO_F3 = 0.0055;

describe('gasVolume', () => {
  describe('Mscf to m3', () => {
    test('ok', async () => {
      const result = convert(MSCF_VALUE).from('Mscf').to('m3');
      await expect(result).toBe(MSCF_TO_M3);
    });
  });

  describe('Mscf to ft3', () => {
    test('ok', async () => {
      const result = convert(MSCF_VALUE).from('Mscf').to('ft3');
      await expect(result).toBe(MSCF_TO_F3);
    });
  });
});
