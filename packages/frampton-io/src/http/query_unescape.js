import memoize from 'frampton-utils/memoize';
import uriDecode from 'frampton-io/http/uri_decode';
import join from 'frampton-string/join';
import split from 'frampton-string/split';

export default memoize(function query_unescape(str) {
  return join(' ', split('+', uriDecode(str)));
});