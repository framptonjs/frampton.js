import assert from 'frampton-utils/assert';
import curry from 'frampton-utils/curry';
import isArray from 'frampton-utils/is_array';

/**
 * @name foldr
 * @memberOf Frampton
 * @static
 */
export default curry(function curried_foldr(fn, acc, xs) {
  assert("Frampton.foldr recieved a non-array", isArray(xs));
  return xs.reduceRight(fn, acc);
});