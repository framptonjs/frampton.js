/**
 * Returns a boolean telling us if a given object is an array
 *
 * @name isArray
 * @memberOf Frampton.Utils
 * @static
 * @param {Object} arr
 * @returns {Boolean}
 */
export default function is_array(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
}