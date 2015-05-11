import { curry } from 'frampton-utils';

//+ map :: (a -> b) -> Monad a -> Monad b
export default curry(function curried_map(mapping, monad) {
  return monad.map(mapping);
});