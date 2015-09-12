import locationStream from 'frampton-history/location_stream';

var instance = null;

/**
 * Returns an EventStream of the current location.hash
 *
 * @name hashStream
 * @method
 * @private
 * @memberof Frampton.History
 * @returns {Frampton.Signals.EventStream}
 */
export default function hash_stream() {
  if (!instance) {
    instance = locationStream().map(loc => loc.hash.replace('#', ''));
  }
  return instance;
}