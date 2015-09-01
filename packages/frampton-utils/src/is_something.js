import isNothing from 'frampton-utils/is_nothing';

/**
 * Returns true/false indicating if object is not null or undefined
 *
 * @name isSomething
 * @memberOf Frampton.Utils
 * @static
 * @param {Any} obj
 * @returns {Boolean}
 */
export default function is_something(obj) {
  return !isNothing(obj);
}