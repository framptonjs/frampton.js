import curry from 'frampton-utils/curry';

/**
 * remove :: Any a -> List a -> List a
 *
 * @name remove
 * @memberOf Frampton
 * @static
 * @param {Object} obj
 * @param {Array} xs
 */
export default curry(function curried_remove(obj, xs) {
  return xs.filter(function(next) {
    return next !== obj;
  });
});