import curry from 'frampton-utils/curry';

/**
 * @name max
 * @method
 * @memberof Frampton.Math
 * @param {Number} left - First number to test
 * @param {Number} right - Second number to test
 * @returns {Number} The larger of the two numbers
 */
export default curry(function max(left, right) {
  return (left > right) ? left : right;
});
