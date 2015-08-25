import assert from 'frampton-utils/assert';
import curry from 'frampton-utils/curry';
import isArray from 'frampton-utils/is_array';

/**
 * @name drop
 * @memberOf Frampton
 */
export default curry(function curried_drop(n, xs) {
  assert("Frampton.drop recieved a non-array", isArray(xs));
  return xs.filter((next) => {
    if (n === 0) {
      return true;
    } else {
      n--;
    }
    return false;
  });
});