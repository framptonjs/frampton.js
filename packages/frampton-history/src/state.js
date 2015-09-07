import stepper from 'frampton-signals/stepper';
import history from 'frampton-history/get_history';
import stateStream from 'frampton-history/state_stream';

var instance = null;

/**
 * A Behavior representing the current history.state
 *
 * @name state
 * @method
 * @memberof Frampton.History
 * @returns {Frampton.Signals.Behavior}
 */
export default function state() {
  if (!instance) {
    instance = stepper(history().state, stateStream());
  }
  return instance;
}