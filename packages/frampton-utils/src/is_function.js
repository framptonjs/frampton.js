/**
 * Returns true/false is the object a fucntion
 *
 * @name isFunction
 * @memberOf Frampton.Utils
 * @static
 * @param {Any} fn
 * @returns {Boolean}
 */
export default function is_function(fn) {
  return (typeof fn === 'function');
}