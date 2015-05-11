import assert from 'frampton-utils/assert';
import isArray from 'frampton-utils/is_array';

/**
 * @name last
 * @memberOf Frampton
 * @static
 */
export function last(xs) {
  assert("Frampton.last recieved a non-array", isArray(xs));
  switch (xs.length) {
    case 0: return null;
    default: return xs[xs.length - 1];
  }
}