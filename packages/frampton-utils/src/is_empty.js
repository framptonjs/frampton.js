import isNothing from 'frampton-utils/is_nothing';

/**
 * Returns a boolean telling us if a given value doesn't exist or has length 0
 *
 * @name isEmpty
 * @method
 * @memberof Frampton.Utils
 * @param {*} obj
 * @returns {Boolean}
 */
export default function is_empty(obj) {
  return (isNothing(obj) || !obj.length || 0 === obj.length);
}