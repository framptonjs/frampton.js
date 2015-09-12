import locationStream from 'frampton-history/location_stream';

var instance = null;

/**
 * Returns an EventStream of updates to location.pathname
 *
 * @name pathStream
 * @member
 * @private
 * @memberof Frampton.History
 * @returns {Frampton.Signals.EventStream}
 */
export default function path_stream() {
  if (!instance) {
    instance = locationStream().map(loc => loc.pathname);
  }
  return instance;
}