import curry from 'frampton-utils/curry';

/**
 * remove :: List a -> Any a -> List a
 *
 * @name remove
 * @memberOf Frampton
 * @static
 * @param {Array} xs
 * @param {Object} obj
 */
export default curry(function curried_remove(obj, xs) {
  return xs.filter(function(next) {
    return next !== obj;
  });
});