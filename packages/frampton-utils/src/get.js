import curry from 'frampton-utils/curry';
import isArray from 'frampton-utils/is_array';
import isNumber from 'frampton-utils/is_number';
import isObject from 'frampton-utils/is_object';
import isString from 'frampton-utils/is_string';

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

  if (isString(prop) && isObject(obj)) {
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
  } else if (isArray(obj) && isNumber(prop)) {
    return (obj[prop] || null);
  } else {
    return null;
  }
});