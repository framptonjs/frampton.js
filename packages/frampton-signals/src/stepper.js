import curry from 'frampton-utils/curry';
import Behavior from 'frampton-signals/behavior';

// stepper :: a -> EventStream a -> Behavior a
export default curry(function stepper(initial, stream) {
  return new Behavior(initial, function(sink) {
    return stream.next((val) => {
      sink(val);
    });
  });
});