import curry from 'frampton-utils/curry';
import mapMany from 'frampton-signals/map_many';

// map :: (a -> b) -> Behavior a -> Behavior b
export default curry(function map(fn, a) {
  return mapMany(() => fn(a.value), a);
});