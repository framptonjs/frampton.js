import curryN from 'frampton-utils/curry_n';
import filter from 'frampton-list/filter';

/**
 * remove :: List a -> Any a -> List a
 *
 * @name remove
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 * @param {Object} obj
 */
export default curryN(2, function curried_remove(obj, xs) {
  return filter((next) => next !== obj, xs);
});
