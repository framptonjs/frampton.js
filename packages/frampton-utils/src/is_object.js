import isSomething from 'frampton-utils/is_something';
import isArray from 'frampton-utils/is_array';

/**
 * Returns true/false is the object a regular Object
 *
 * @name isObject
 * @method
 * @memberof Frampton.Utils
 * @param {*} obj
 * @returns {Boolean}
 */
export default function isObject(obj) {
  return (isSomething(obj) && !isArray(obj) && typeof obj === 'object');
}