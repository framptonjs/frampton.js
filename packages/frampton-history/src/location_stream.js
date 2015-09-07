import historyStream from 'frampton-history/history_stream';

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
    instance = historyStream().map((evt) => {
      return evt.target.location;
    });
  }
  return instance;
}