import assert from 'frampton-utils/assert';
import curry from 'frampton-utils/curry';
import isArray from 'frampton-utils/is_array';

/**
 * @name foldl
 * @memberOf Frampton
 * @static
 */
export default curry(function curried_foldl(fn, acc, xs) {
  assert("Frampton.foldl recieved a non-array", isArray(xs));
  return xs.reduce(fn, acc);
});