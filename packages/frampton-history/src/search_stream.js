import locationStream from 'frampton-history/location_stream';
import parseSearch from 'frampton-history/parse_search';

var instance = null;

/**
 * Returns an EventStream of updates to location.search
 *
 * @name searchStream
 * @method
 * @private
 * @memberof Frampton.History
 * @returns {Frampton.Signals.EventStream}
 */
export default function hash_stream() {
  if (!instance) {
    instance = locationStream().map((loc) => {
      return parseSearch(loc.search || '');
    });
  }
  return instance;
}