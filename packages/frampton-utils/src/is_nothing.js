import isUndefined from 'frampton-utils/is_undefined';
import isNull from 'frampton-utils/is_null';

/**
 * Returns true/false is the object null or undefined
 *
 * @name isNothing
 * @method
 * @memberof Frampton.Utils
 * @param {*} obj
 * @returns {Boolean}
 */
export default function is_nothing(obj) {
  return (isUndefined(obj) || isNull(obj));
}