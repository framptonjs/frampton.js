import curry from 'frampton-utils/curry';

/**
 * (===) equality between two values
 *
 * @name isEqual
 * @method
 * @memberof Frampton.Utils
 * @param {*} a
 * @param {*} b
 * @returns {Boolean}
 */
export default curry(function is_equal(a, b) {
  return (a === b);
});
