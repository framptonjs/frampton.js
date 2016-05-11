import assert from 'frampton-utils/assert';
import curry from 'frampton-utils/curry';
import isArray from 'frampton-utils/is_array';

/**
 * @name foldl
 * @method
 * @memberof Frampton.List
 */
export default curry(function curried_foldl(fn, acc, xs) {
  assert("Frampton.foldl recieved a non-array", isArray(xs));
  const len = xs.length;
  for (let i = 0; i < len; i++) {
    acc = fn(acc, xs[i]);
  }
  return acc;
});