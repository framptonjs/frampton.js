import historyStream from 'frampton-history/history_stream';
import location from 'frampton-history/get_location';

var instance = null;

/**
 * @name locationStream
 * @method
 * @private
 * @memberof Frampton.History
 * @returns {Frampton.Signals.EventStream}
 */
export default function location_stream() {
  if (!instance) {
    instance = historyStream().map(() => location());
  }
  return instance;
}