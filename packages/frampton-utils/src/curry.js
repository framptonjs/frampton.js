import assert from 'frampton-utils/assert';
import isFunction from 'frampton-utils/is_function';

/**
 * Takes a function and returns a new function that will wait to execute the original
 * function until it has received all of its arguments. Each time the function is called
 * without receiving all of its arguments it will return a new function waiting for the
 * remaining arguments.
 *
 * @name curry
 * @memberOf Frampton
 * @static
 * @param {Function} curry - Function to curry.
 */
export default function curry(fn, ...args) {

  assert('Argument passed to curry is not a function', isFunction(fn));

  var arity = fn.length;

  function curried(...args2) {

    // an array of arguments for this instance of the curried function
    var locals = args;

    if (arguments.length > 0) {
      locals = locals.concat(args2);
    }

    if (locals.length >= arity) {
      return fn.apply(null, locals);
    } else {
      return curry.apply(null, [fn].concat(locals));
    }
  }

  return args.length >= arity ? curried() : curried;
}