import curryN from 'frampton-utils/curry_n';
import assert from 'frampton-utils/assert';
import isDefined from 'frampton-utils/is_defined';
import isArray from 'frampton-utils/is_array';

/**
 * @name at
 * @method
 * @memberof Frampton.List
 */
export default curryN(2, function at(index, xs) {
  assert("Frampton.List.at recieved a non-array", isArray(xs));
  return isDefined(xs[index]) ? xs[index] : null;
});
