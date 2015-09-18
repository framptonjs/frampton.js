import curry from 'frampton-utils/curry';

/**
 * ap(<*>) :: (a -> b) -> Monad a -> Monad b
 *
 * @name ap
 * @method
 * @memberof Frampton.Monad
 * @param {Function} fn
 * @param {Object} monad
 * @returns {Object}
 */
export default curry(function curried_ap(fn, monad) {
  return monad.ap(fn);
});