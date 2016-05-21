import warn from 'frampton-utils/warn';

/**
 * Create a function that can only be called once.
 *
 * @name once
 * @method
 * @memberof Frampton.Utils
 * @param {Function} fn
 * @returns {Function}
 */
export default function once(fn) {
  var called = false;
  return function(...args) {
    if (called === false) {
      called = true;
      return fn.apply(null, args);
    } else {
      warn('Once function called multiple times');
    }
  };
}
