/**
 * Returns a boolean telling us if a given object is an array
 *
 * @name isArray
 * @method
 * @memberof Frampton.Utils
 * @param {Object} arr
 * @returns {Boolean}
 */
export default function is_array(arr) {
  return ((Array.isArray) ?
    Array.isArray(arr) :
    Object.prototype.toString.call(arr) === "[object Array]");
}