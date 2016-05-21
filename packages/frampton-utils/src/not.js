/**
 * not :: Function -> a -> Boolean
 *
 * @name not
 * @method
 * @memberof Frampton.Utils
 * @param {Function} fn
 * @returns {Boolean}
 */
export default function not(fn) {
  return function(arg) {
    return !fn(arg);
  };
}
