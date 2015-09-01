/**
 * Returns true/false indicating if object is a String
 *
 * @name isString
 * @memberOf Frampton.Utils
 * @static
 * @param {Any} obj
 * @returns {Boolean}
 */
export default function is_string(obj) {
  return (typeof obj === 'string');
}