import curry from 'frampton-utils/curry';
import Behavior from 'frampton-signals/behavior';

/**
 * accumB :: a -> EventStream (a -> b) -> Behavior b
 *
 * @name accumB
 * @memberof Frampton.Signals
 * @static
 * @param {*}         initial
 * @param {Frampton.Signals.EventStream} stream
 */
export default curry(function accumB(initial, stream) {
  return new Behavior(initial, (sink) => {
    return stream.next((fn) => {
      sink(fn(initial));
    });
  });
});