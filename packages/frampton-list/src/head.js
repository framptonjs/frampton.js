import assert from 'frampton-utils/assert';
import isDefined from 'frampton-utils/is_defined';
import isArray from 'frampton-utils/is_array';

/**
 * @name head
 * @method
 * @memberof Frampton.List
 */
export default function head(xs) {
  assert("Frampton.head recieved a non-array", isArray(xs));
  return isDefined(xs[0]) ? xs[0] : null;
}