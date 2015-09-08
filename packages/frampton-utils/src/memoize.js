import isString from 'frampton-utils/is_string';
import isNumber from 'frampton-utils/is_number';

/**
 * @name memoize
 * @method
 * @memberof Frampton.Utils
 * @param {Function} fn
 * @param {Object}   [context]
 * @returns {Function}
 */
export default function memoize(fn, context) {

  var store = {};
  var len = fn.length;

  return function(...args) {

    var key = (
      (len === 1 && (isString(args[0]) || isNumber(args[0]))) ?
      args[0] : JSON.stringify(args)
    );

    if (key in store) {
      return store[key];
    } else {
      return (store[key] = fn.apply((context || null), args));
    }
  };
}