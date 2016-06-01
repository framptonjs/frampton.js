import curry from 'frampton-utils/curry';

/**
 * @name add
 * @method
 * @memberof Frampton.Math
 * @param {Number} left
 * @param {Number} right
 * @returns {Number}
 */
export default curry(function add(left, right) {
  return (left + right);
});
