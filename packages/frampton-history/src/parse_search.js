import memoize from 'frampton-utils/memoize';
import queryUnescape from 'frampton-io/http/query_unescape';

function validPair(pair) {
  return (
    (pair.length === 2) &&
    (pair[0] !== '') &&
    (pair[1] !== '')
  );
}

/**
 * Takes a URL query string and returns a hash of key/values
 * @name parseSearch
 * @method
 * @private
 * @memberof Frampton.History
 * @param {String} search Query string to parse
 * @returns {Object}
 */
export default memoize(function parse_search(search) {
  var obj = {};
  var parts = search.replace('?', '').split('&');
  parts.forEach((part) => {
    var pair = part.split('=');
    // check we have a properly-formed key/value pair.
    if (validPair(pair)) {
      obj[queryUnescape(pair[0])] = queryUnescape(pair[1]);
    }
  });
  return obj;
});