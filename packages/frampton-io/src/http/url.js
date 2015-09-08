import curry from 'frampton-utils/curry';
import join from 'frampton-string/join';
import asList from 'frampton-object/as_list';
import queryPair from 'frampton-io/http/query_pair';

/**
 * url_builder :: String -> Object -> String
 *
 * @name url
 * @method
 * @memberof Frampton.IO.Http
 * @param {String} domain
 * @param {Object} args
 * @returns {String}
 */
export default curry(function url_builder(domain, args) {
  if (!args) return domain;
  return domain + '?' + join('&', asList(args).map(queryPair));
});