import assert from 'frampton-utils/assert';
import curryN from 'frampton-utils/curry_n';
import isArray from 'frampton-utils/is_array';

/**
 * @name foldr
 * @method
 * @memberof Frampton.List
 */
export default curryN(3, function curried_foldr(fn, acc, xs) {
  assert("Frampton.List.foldr recieved a non-array", isArray(xs));
  var len = xs.length;
  while (len--) {
    acc = fn(acc, xs[len]);
  }
  return acc;
});
