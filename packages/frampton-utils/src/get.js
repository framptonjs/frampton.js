import curry from 'frampton-utils/curry';

/**
 * get :: String -> Object -> Any
 *
 * @name get
 * @memberOf Frampton.Utils
 * @static
 * @param {String} prop
 * @param {Object} obj
 * @returns {Any}
 */
export default curry(function get(prop, obj) {
  return (obj[prop] || null);
});