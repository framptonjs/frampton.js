import stepper from 'frampton-signals/stepper';
import location from 'frampton-history/get_location';
import hashStream from 'frampton-history/hash_stream';

var instance = null;

/**
 * A Behavior representing the current location.hash
 *
 * @name hash
 * @method
 * @memberof Frampton.History
 * @returns {Frampton.Signals.Behavior}
 */
export default function hash() {
  if (!instance) {
    instance = stepper(location().hash, hashStream());
  }
  return instance;
}