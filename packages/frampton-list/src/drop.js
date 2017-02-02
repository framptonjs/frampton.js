import assert from 'frampton-utils/assert';
import curryN from 'frampton-utils/curry_n';
import isArray from 'frampton-utils/is_array';
import filter from 'frampton-list/filter';

/**
 * @name drop
 * @method
 * @memberof Frampton.List
 */
export default curryN(2, function curried_drop(n, xs) {
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
