import curry from 'frampton-utils/curry';
import Behavior from 'frampton-signals/behavior';

// toggle :: Boolean -> EventStream a -> Behavior Boolean
export default curry(function toggle(initial, stream) {
  return new Behavior(!!initial, function(sink) {
    return stream.next((val) => {
      setTimeout(() => {
        if (initial) {
          sink((initial = false));
        } else {
          sink((initial = true));
        }
      }, 0);
    });
  });
});