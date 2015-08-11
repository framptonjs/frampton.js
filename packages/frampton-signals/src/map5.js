import curry from 'frampton-utils/curry';
import mapMany from 'frampton-signals/map_many';

// map5 :: (a -> b -> c -> d -> e -> f) -> Behavior a -> Behavior b -> Behavior c -> Behavior d -> Behavior e -> Behavior f
export default curry(function map5(fn, a, b, c, d, e) {
  return mapMany(() => fn(a.value, b.value, c.value, d.value, e.value), a, b, c, d, e);
});