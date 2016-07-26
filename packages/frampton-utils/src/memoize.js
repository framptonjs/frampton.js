import isString from 'frampton-utils/is_string';
import isNumber from 'frampton-utils/is_number';

/**
 * @name memoize
 * @method
 * @memberof Frampton.Utils
 * @param {Function} fn
 * @returns {Function}
 */
export default function memoize(fn) {

  const store = {};
  const len = fn.length;

  return function(...args) {

    const key = (
      (len === 1 && (isString(args[0]) || isNumber(args[0]))) ?
      args[0] : JSON.stringify(args)
    );

    if (key in store) {
      return store[key];
    } else {
      return (store[key] = fn(...args));
    }
  };
}
