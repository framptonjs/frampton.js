/**
 * Takes a function and warps it to be called at a later time.
 *
 * @name apply
 * @method
 * @memberof Frampton.Utils
 * @param {Function} fn      The function to wrap.
 * @param {Object}   thisArg Context in which to apply function.
 */
export default function apply(fn) {
  return fn.call(null);
}
