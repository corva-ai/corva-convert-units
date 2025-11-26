const convert = require("../index");

const MEASUREMENT_PRECISION = 10;

const conversionTable = [
  { from: "ft", amount: 1, to: "usft", expected: 0.999998 },
  { from: "ft", amount: 1, to: "m", expected: 0.3047999902 },

  { from: "usft", amount: 1, to: "m", expected: 0.3048005998 },
  { from: "usft", amount: 1, to: "ft", expected: 1.000002 },
];

describe("surveyLength", () => {
  it("should be present in measures", () => {
    const measureList = convert().list("surveyLength");
    expect(measureList).not.toHaveLength(0);
  });

  describe("conversions", () => {
    for (let { from, to, amount, expected } of conversionTable) {
      it(`should correctly convert ${amount} "${from}" to "${to}"`, () => {
        expect(convert(amount).from(from).to(to)).toBeCloseTo(
          expected,
          MEASUREMENT_PRECISION
        );
      });
    }
  });
});
