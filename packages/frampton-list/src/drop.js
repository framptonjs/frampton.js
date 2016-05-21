import assert from 'frampton-utils/assert';
import curry from 'frampton-utils/curry';
import isArray from 'frampton-utils/is_array';
import filter from 'frampton-list/filter';

/**
 * @name drop
 * @method
 * @memberof Frampton.List
 */
export default curry(function curried_drop(n, xs) {
  assert("Frampton.List.drop recieved a non-array", isArray(xs));
  return filter((next) => {
    if (n === 0) {
      return true;
    } else {
      n--;
    }
    return false;
  }, xs);
});
