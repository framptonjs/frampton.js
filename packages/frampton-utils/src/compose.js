import assert from 'frampton-utils/assert';
import foldr from 'frampton-list/foldr';
import first from 'frampton-list/first';

/**
 * Compose takes any number of functions and returns a function that when
 * executed will call the passed functions in order, passing the return of
 * each function to the next function in the execution order.
 *
 * @name compose
 * @memberof Frampton.Utils
 * @method
 * @param {function} functions - Any number of function used to build the composition.
 * @returns {function} A new function that runs each of the given functions in succession
 */
export default function compose(...fns) {
  assert("Compose did not receive any arguments. You can't compose nothing.", (fns.length > 0));
  return function composition(...args) {
    return first(foldr(function(args, fn) {
      return [ fn(...args) ];
    }, args, fns));
  };
}
