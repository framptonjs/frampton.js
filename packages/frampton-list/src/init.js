import assert from 'frampton-utils/assert';
import isArray from 'frampton-utils/is_array';

/**
 * @name init
 * @memberOf Frampton
 * @static
 */
export default function init(xs) {
  assert("Frampton.init recieved a non-array", isArray(xs));
  switch (xs.length) {
    case 0: return [];
    default: return xs.slice(0, (xs.length - 1));
  }
}