import curry from 'frampton-utils/curry';

/**
 * join :: String -> Array String -> String
 * @name join
 * @method
 * @memberof Frampton.String
 * @param {String} sep
 * @param {Array} strs
 * @returns {String}
 */
export default curry(function join(sep, strs) {
  return strs.join(sep);
});