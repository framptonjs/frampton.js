import isUndefined from 'frampton-utils/is_undefined';
import isNull from 'frampton-utils/is_null';

/**
 * Returns true/false is the object null or undefined
 *
 * @name isNothing
 * @memberOf Frampton.Utils
 * @static
 * @param {Any} obj
 * @returns {Boolean}
 */
export default function is_nothing(obj) {
  return (isUndefined(obj) || isNull(obj));
}