import curry from 'frampton-utils/curry';
import mapMany from 'frampton-signals/map_many';

// map2 :: (a -> b -> c) -> Behavior a -> Behavior b -> Behavior c
export default curry(function map2(fn, a, b) {
  return mapMany(() => fn(a.value, b.value), a, b);
});