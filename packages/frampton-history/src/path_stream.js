import locationStream from 'frampton-history/location_stream';

var instance = null;

export default function path_stream() {
  if (!instance) {
    instance = locationStream().map((loc) => {
      return loc.pathname;
    });
  }
  return instance;
}