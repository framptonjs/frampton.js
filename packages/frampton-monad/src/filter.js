import curry from 'frampton-utils/curry';

//+ filter :: (a -> b) -> Monad a -> Monad b
export default curry(function curried_filter(predicate, monad) {
  return monad.filter(predicate);
});