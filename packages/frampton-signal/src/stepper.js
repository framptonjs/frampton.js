import curry from 'frampton-utils/curry';
import createSignal from 'frampton-signal/create';

// stepper :: a -> Signal a -> Signal a
export default curry((initial, updater) => {
  const sig = createSignal(initial);
  return sig.merge(updater.dropRepeats());
});