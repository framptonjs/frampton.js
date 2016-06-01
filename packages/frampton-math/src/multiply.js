import curry from 'frampton-utils/curry';

/**
 * @name multiply
 * @method
 * @memberof Frampton.Math
 * @param {Number} a
 * @param {Number} b
 * @returns {Number}
 */
export default curry(function multiply(a, b) {
  return a * b;
});
