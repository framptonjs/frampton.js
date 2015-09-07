import locationStream from 'frampton-history/location_stream';

var instance = null;

/**
 * @name hashStream
 * @method
 * @private
 * @memberof Frampton.History
 * @returns {Frampton.Signals.EventStream}
 */
export default function hash_stream() {
  if (!instance) {
    instance = locationStream().map((loc) => {
      return loc.hash.replace('#', '');
    });
  }
  return instance;
}