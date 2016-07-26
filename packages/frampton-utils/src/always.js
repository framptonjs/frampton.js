import curryN from 'frampton-utils/curry_n';

/**
 * Create a function that always returns the same value every time
 * it is called
 *
 * @name always
 * @method
 * @memberof Frampton.Utils
 * @param {Function} fn The function to wrap.
 * @param {*} args The arguments to pass to the function.
 */
export default curryN(2, function always(fn, ...args) {
  var value;
  return function() {
    if (value === undefined) {
      value = fn(...args);
    }
    return value;
  };
});
