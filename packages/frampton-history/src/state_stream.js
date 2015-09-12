import historyStream from 'frampton-history/history_stream';

var instance = null;

/**
 * Returns an EventStream of updates to history.state
 *
 * @name stateStream
 * @method
 * @private
 * @memberof Frampton.History
 * @returns {Frampton.Signals.EventStream}
 */
export default function state_stream() {
  if (!instance) {
    instance = historyStream().map((h) => h.state);
  }
  return instance;
}