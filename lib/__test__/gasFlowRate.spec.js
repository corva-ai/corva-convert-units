var convert = require("../index");

const VALUE = 1;
const MSCF_TO_M3 = 28.316846592;
const M3_TO_MSCF = 0.035314666721488586;

describe("gasVolume", () => {
  describe("Mscf/day to m3/day", () => {
    test("ok", () => {
      const result = convert(VALUE).from("Mscf/day").to("m3/day");
      expect(result).toBe(MSCF_TO_M3);
    });
  });

  describe("m3/day to Mscf/day", () => {
    test("ok", () => {
      const result = convert(VALUE).from("m3/day").to("Mscf/day");
      expect(result).toBe(M3_TO_MSCF);
    });
  });
});
