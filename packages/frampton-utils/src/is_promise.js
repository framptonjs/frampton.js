import isObject from 'frampton-utils/is_object';
import isFunction from 'frampton-utils/is_function';

/**
 * Returns true/false indicating if object appears to be a Promise
 *
 * @name isPromise
 * @method
 * @memberof Frampton.Utils
 * @param {*} obj
 * @returns {Boolean}
 */
export default function is_promise(obj) {
  return (isObject(obj) && isFunction(obj.then));
}