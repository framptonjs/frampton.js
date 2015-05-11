import { curry } from 'frampton-utils';

//+ ap(<*>) :: (a -> b) -> Monad a -> Monad b
export default curry(function curried_ap(fn, monad) {
  return monad.ap(fn);
});