import curry from 'frampton-utils/curry';
import join from 'frampton-string/join';
import asList from 'frampton-object/as_list';
import queryPair from 'frampton-http/query_pair';

// url_builder :: String -> Object -> String
export default curry(function url_builder(domain, args) {
  if (!args) return domain;
  return domain + '?' + join('&', asList(args).map(queryPair));
});