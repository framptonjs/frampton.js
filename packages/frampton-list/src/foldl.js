import assert from 'frampton-utils/assert';
import curryN from 'frampton-utils/curry_n';
import isArray from 'frampton-utils/is_array';

/**
 * @name foldl
 * @method
 * @memberof Frampton.List
 */
export default curryN(3, function curried_foldl(fn, acc, xs) {
  assert("Frampton.List.foldl recieved a non-array", isArray(xs));
  const len = xs.length;
  for (let i = 0; i < len; i++) {
    acc = fn(acc, xs[i]);
  }
  return acc;
});
