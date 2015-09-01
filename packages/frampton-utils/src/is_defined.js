import isUndefined from 'frampton-utils/is_undefined';

/**
 * Returns a boolean telling us if a given value is defined
 *
 * @name isDefined
 * @memberOf Frampton.Utils
 * @static
 * @param {Any} obj
 * @returns {Boolean}
 */
export default function is_defined(obj) {
  return !isUndefined(obj);
}