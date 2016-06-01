import curry from 'frampton-utils/curry';

/**
 * @name subtract
 * @method
 * @memberof Frampton.Math
 * @param {Number} left
 * @param {Number} right
 * @returns {Number}
 */
export default curry(function(left, right) {
  return (left - right);
});
