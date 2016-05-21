import curry from 'frampton-utils/curry';
import assert from 'frampton-utils/assert';
import isDefined from 'frampton-utils/is_defined';
import isArray from 'frampton-utils/is_array';

/**
 * @name at
 * @method
 * @memberof Frampton.List
 */
export default curry(function at(index, xs) {
  assert("Frampton.List.at recieved a non-array", isArray(xs));
  return isDefined(xs[index]) ? xs[index] : null;
});
