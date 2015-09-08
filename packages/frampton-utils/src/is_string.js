/**
 * Returns true/false indicating if object is a String
 *
 * @name isString
 * @method
 * @memberof Frampton.Utils
 * @param {*} obj
 * @returns {Boolean}
 */
export default function is_string(obj) {
  return (typeof obj === 'string');
}