import historyStream from 'frampton-history/history_stream';

/**
 * @name historyChange
 * @method
 * @memberof Frampton.History
 * @param {Function} fn A function to call when history changes
 * @return {Function} A function to unsubscribe from changes
 */
export default function history_change(fn) {
  return historyStream().next(fn);
}