/**
 * Returns a boolean telling us if a given value is a boolean
 *
 * @name isBoolean
 * @memberOf Frampton.Utils
 * @static
 * @param {Any} obj
 * @returns {Boolean}
 */
export default function is_boolean(obj) {
  return (typeof obj === 'boolean');
}