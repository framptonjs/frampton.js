/**
 * Takes a function and warps it to be called at a later time.
 * @name lazy
 * @memberof Frampton
 * @method
 * @method
 * @static
 * @param {Function} fn The function to wrap.
 * @param {...Any} args Arguments to pass to the function when called.
 */
export default function lazy(fn, ...args) {
  return function() {
    fn.apply(null, args);
  };
}