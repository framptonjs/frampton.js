import curry from 'frampton-utils/curry';
import isNothing from 'frampton-utils/is_nothing';
import isString from 'frampton-utils/is_string';
import isObject from 'frampton-utils/is_object';
import isPrimitive from 'frampton-utils/is_primitive';

/**
 * get :: String -> Object -> Any
 *
 * @name get
 * @method
 * @memberof Frampton.Utils
 * @param {String} prop
 * @param {Object} obj
 * @returns {*}
 */
export default curry(function get(prop, obj) {

  if (isPrimitive(obj) || isNothing(obj)) {
    return null;
  } else if (isString(prop)) {
    const parts = (prop || '').split('.').filter((val) => {
      return val.trim() !== '';
    });

    if (parts.length > 1) {
      const [head, ...tail] = parts;
      const sub = obj[head];
      return (isObject(sub)) ? get(tail.join('.'), sub) : null;
    } else {
      return (obj[parts[0]] || null);
    }
  } else {
    return (obj[prop] || null);
  }
});