import { curry } from 'frampton-utils';
import Behavior from 'frampton-signals/behavior';

// accumB :: a -> EventStream (a -> b) -> Behavior b
export default curry(function accumB(initial, stream) {
  return new Behavior(initial, function(behavior) {
    return stream.next(function(fn) {
      behavior.update(fn(initial));
    });
  });
});