import assert from 'frampton-utils/assert';
import curry from 'frampton-utils/curry';
import isArray from 'frampton-utils/is_array';
import copy from 'frampton-list/copy';

/**
 * @name drop
 * @memberOf Frampton
 */
export default curry(function curried_drop(n, xs) {
  assert("Frampton.drop recieved a non-array", isArray(xs));
  return copy(xs, n);
});