import curry from 'frampton-utils/curry';

/**
 * @name modulo
 * @method
 * @memberof Frampton.Math
 * @param {Number} left
 * @param {Number} right
 * @returns {Number}
 */
export default curry(function modulo(left, right) {
  return left % right;
});
