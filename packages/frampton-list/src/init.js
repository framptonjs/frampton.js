import assert from 'frampton-utils/assert';
import isArray from 'frampton-utils/is_array';

/**
 * @name init
 * @method
 * @memberof Frampton.List
 */
export default function init(xs) {
  assert("Frampton.List.init recieved a non-array", isArray(xs));
  switch (xs.length) {

    case 0:
      return [];

    default:
      return xs.slice(0, (xs.length - 1));
  }
}
