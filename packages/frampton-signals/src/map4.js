import curry from 'frampton-utils/curry';
import mapMany from 'frampton-signals/map_many';

// map4 :: (a -> b -> c -> d -> e) -> Behavior a -> Behavior b -> Behavior c -> Behavior d -> Behavior e
export default curry(function map4(fn, a, b, c, d) {
  return mapMany(() => fn(a.value, b.value, c.value, d.value), a, b, c, d);
});