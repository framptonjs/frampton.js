import curry from 'frampton-utils/curry';

/**
 * filter :: (a -> b) -> Monad a -> Monad b
 *
 * @name filter
 * @method
 * @memberof Frampton.Monad
 * @param {Function} predicate
 * @param {Object} monad
 * @returns {Object}
 */
export default curry(function curried_filter(predicate, monad) {
  return monad.filter(predicate);
});