import curry from 'frampton-utils/curry';

/**
 * (===) equality between two values
 *
 * @name isEqual
 * @memberOf Frampton.Utils
 * @static
 * @param {Any} a
 * @param {Any} b
 * @returns {Boolean}
 */
export default curry(function is_equal(a, b) {
  return (a === b);
});