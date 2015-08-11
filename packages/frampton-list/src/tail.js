/**
 * @name tail
 * @memberOf Frampton
 * @static
 */
import assert from 'frampton-utils/assert';
import isArray from 'frampton-utils/is_array';

export default function tail(xs) {
  assert("Frampton.tail recieved a non-array", isArray(xs));
  switch (xs.length) {
    case 0: return [];
    default: return xs.slice(1);
  }
}