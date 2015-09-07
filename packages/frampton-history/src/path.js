import stepper from 'frampton-signals/stepper';
import location from 'frampton-history/get_location';
import pathStream from 'frampton-history/path_stream';

var instance = null;

/**
 * A Behavior representing the current location.pathname
 *
 * @name path
 * @method
 * @memberof Frampton.History
 * @returns {Frampton.Signals.Behavior}
 */
export default function path() {
  if (!instance) {
    instance = stepper(location().pathname, pathStream());
  }
  return instance;
}