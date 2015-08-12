import curry from 'frampton-utils/curry';

//+ chain(>>=) :: Monad a -> Monad b -> Monad b
export default curry(function curried_ap(monad1, monad2) {
  return monad1.chain(monad2);
});