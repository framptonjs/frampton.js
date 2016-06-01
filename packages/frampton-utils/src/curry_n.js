import assert from 'frampton-utils/assert';
import isFunction from 'frampton-utils/is_function';

/**
 * Takes a function and returns a new function that will wait to execute the original
 * function until it has received all of its arguments. Each time the function is called
 * without receiving all of its arguments it will return a new function waiting for the
 * remaining arguments.
 *
 * @name curryN
 * @memberof Frampton.Utils
 * @method
 * @param {Number} arity - Number of arguments for function
 * @param {Function} curry - Function to curry.
 * @returns {Function} A curried version of the function passed in.
 */
export default function curry_n(arity, fn, ...args) {

  assert('Argument passed to curry is not a function', isFunction(fn));

  function curried(...args2) {

    // an array of arguments for this instance of the curried function
    const locals = args.concat(args2);

    if (locals.length >= arity) {
      return fn.apply(null, locals);
    } else {
      return curry_n.apply(null, [arity, fn].concat(locals));
    }
  }

  return ((args.length >= arity) ? curried() : curried);
}
