import assert from 'frampton-utils/assert';
import copy from 'frampton-list/copy';
import foldr from 'frampton-list/foldr';
import head from 'frampton-list/head';

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
export default function compose(/* functions */) {
  var fns = copy(arguments);
  assert("Compose did not receive any arguments. You can't compose nothing. Stoopid.", (fns.length > 0));
  return function composition() {
    return head(foldr(function(args, fn) {
      return [fn.apply(this, args)];
    }, copy(arguments), fns));
  };
}