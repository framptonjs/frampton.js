import curry from 'frampton-utils/curry';

/**
 * replace :: String -> String -> String -> String
 * @name replace
 * @method
 * @memberof Frampton.String
 * @param {String} newSubStr
 * @param {String} oldSubStr
 * @param {String} str
 * @returns {String}
 */
export default curry(function replace(newSubStr, oldSubStr, str) {
  return str.replace(oldSubStr, newSubStr);
});