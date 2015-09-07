import memoize from 'frampton-utils/memoize';

export default memoize(function uri_encode(str) {
  return encodeURIComponent(str);
});