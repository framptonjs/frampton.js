import curry from 'frampton-utils/curry';
import mapMany from 'frampton-signals/map_many';

// map3 :: (a -> b -> c -> d) -> Behavior a -> Behavior b -> Behavior c -> Behavior d
export default curry(function map3(fn, a, b, c) {
  return mapMany(() => fn(a.value, b.value, c.value), a, b, c);
});