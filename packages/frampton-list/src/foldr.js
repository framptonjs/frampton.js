import assert from 'frampton-utils/assert';
import curry from 'frampton-utils/curry';
import isArray from 'frampton-utils/is_array';

/**
 * @name foldr
 * @method
 * @memberof Frampton.List
 */
export default curry(function curried_foldr(fn, acc, xs) {
  assert("Frampton.foldr recieved a non-array", isArray(xs));
  var len = xs.length;
  while (len--) {
    acc = fn(acc, xs[len]);
  }
  return acc;
});