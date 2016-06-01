import curry from 'frampton-utils/curry';

/**
 * @name min
 * @method
 * @memberof Frampton.Math
 * @param {Number} left - First number to test
 * @param {Number} right - Second number to test
 * @returns {Number} The smaller of the two numbers
 */
export default curry(function min(left, right) {
  return (left < right) ? left : right;
});
