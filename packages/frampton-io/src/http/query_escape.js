import memoize from 'frampton-utils/memoize';
import uriEncode from 'frampton-io/http/uri_encode';
import join from 'frampton-string/join';
import split from 'frampton-string/split';

export default memoize(function query_escape(str) {
  return join('+', split('%20', uriEncode(str)));
});