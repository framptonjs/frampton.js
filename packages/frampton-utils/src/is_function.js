/**
 * Returns true/false is the object a fucntion
 *
 * @name isFunction
 * @method
 * @memberof Frampton.Utils
 * @param {*} fn
 * @returns {Boolean}
 */
export default function is_function(fn) {
  return (typeof fn === 'function');
}