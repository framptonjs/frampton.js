import curry from 'frampton-utils/curry';

/**
 * map :: (a -> b) -> Monad a -> Monad b
 *
 * @name map
 * @method
 * @memberof Frampton.Monad
 * @param {Function} mapping
 * @param {Object} monad
 * @returns {Object}
 */
export default curry(function curried_map(mapping, monad) {
  return monad.map(mapping);
});