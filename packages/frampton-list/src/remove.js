import curry from 'frampton-utils/curry';
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
export default curry(function curried_remove(obj, xs) {
  return filter((next) => next !== obj, xs);
});