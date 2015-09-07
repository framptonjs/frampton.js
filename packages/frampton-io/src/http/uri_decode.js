import memoize from 'frampton-utils/memoize';

export default memoize(function uri_decode(str) {
  return decodeURIComponent(str);
});