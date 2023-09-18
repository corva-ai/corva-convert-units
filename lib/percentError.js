/**
 * @param {number} expected
 * @param {number} actual
 * @returns {number}
 */
module.exports = function(expected, actual) {
  return Math.abs((expected - actual) / actual);
};
