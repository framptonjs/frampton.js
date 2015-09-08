import curry from 'frampton-utils/curry';

/**
 * get :: String -> Object -> Any
 *
 * @name get
 * @method
 * @memberof Frampton.Utils
 * @param {String} prop
 * @param {Object} obj
 * @returns {*}
 */
export default curry(function get(prop, obj) {
  return (obj[prop] || null);
});