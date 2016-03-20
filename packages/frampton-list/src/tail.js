/**
 * @name tail
 * @method
 * @memberof Frampton.List
 */
import assert from 'frampton-utils/assert';
import isArray from 'frampton-utils/is_array';

export default function tail(xs) {
  assert("Frampton.tail recieved a non-array", isArray(xs));
  switch (xs.length) {
    case 0: return Object.freeze([]);
    default: return Object.freeze(xs.slice(1));
  }
}