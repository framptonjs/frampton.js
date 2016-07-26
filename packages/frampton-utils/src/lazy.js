import curryN from 'frampton-utils/curry_n';

/**
 * Takes a function and warps it to be called at a later time.
 *
 * @name lazy
 * @method
 * @memberof Frampton.Utils
 * @param {Function} fn The function to wrap.
 * @param {Array} args Array of arguments to pass to the function when called.
 */
export default curryN(2, function lazy(fn, args) {
  return () => fn.apply(null, args);
});
