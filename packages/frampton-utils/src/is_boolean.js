/**
 * Returns a boolean telling us if a given value is a boolean
 *
 * @name isBoolean
 * @method
 * @memberof Frampton.Utils
 * @param {*} obj
 * @returns {Boolean}
 */
export default function is_boolean(obj) {
  return (typeof obj === 'boolean');
}