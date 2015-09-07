import get from 'frampton-utils/get';
import historyStream from 'frampton-history/history_stream';

var instance = null;

/**
 * @name stateStream
 * @method
 * @private
 * @memberof Frampton.History
 * @returns {Frampton.Signals.EventStream}
 */
export default function state_stream() {
  if (!instance) {
    instance = historyStream().map(get('state'));
  }
  return instance;
}