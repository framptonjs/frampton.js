import uriEncode from 'frampton-io/http/uri_encode';
import join from 'frampton-string/join';
import split from 'frampton-string/split';

export default function(str) {
  return join('+', split('%20', uriEncode(str)));
}