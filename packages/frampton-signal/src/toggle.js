import assert from 'frampton-utils/assert';
import curry from 'frampton-utils/curry';
import isBoolean from 'frampton-utils/is_boolean';
import createSignal from 'frampton-signal/create';

/**
 * toggle :: Boolean -> Signal a -> Signal Boolean
 *
 * Creates a signal that emits alternating Boolean values on occurences of input signal.
 *
 * @name toggle
 * @method
 * @memberof Frampton.Signal
 * @param {Boolean} initial Value to initialize toggle to
 * @param {Frampton.Signal.Signal} updater Signal to update toggle to
 * @returns {Frampton.Signal.Signal}
 */
export default curry((initial, updater) => {
  assert('Signal.toggle must be initialized with a Boolean', isBoolean(initial));
  const sig = createSignal(initial);
  var current = initial;
  return sig.merge(updater.map(() => {
    current = !current;
    return current;
  }));
});