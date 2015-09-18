import curry from 'frampton-utils/curry';

/**
 * chain(>>=) :: Monad a -> Monad b -> Monad b
 *
 * @name chain
 * @method
 * @memberof Frampton.Monad
 * @param {Object} monad1
 * @param {Object} monad2
 * @returns {Object}
 */
export default curry(function curried_ap(monad1, monad2) {
  return monad1.chain(monad2);
});