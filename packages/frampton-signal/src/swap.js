import curry from 'frampton-utils/curry';
import stepper from 'frampton-signal/stepper';

/**
 * swap :: Signal a -> Signal b -> Signal Boolean
 *
 * @name swap
 * @method
 * @memberof Frampton.Signal
 * @param {Frampton.Signal.Signal} sig1
 * @param {Frampton.Signal.Signal} sig2
 * @returns {Frampton.Signal.Signal}
 */
export default curry(function toggle(sig1, sig2) {
  return stepper(false, sig1.map(true).merge(sig2.map(false)));
});