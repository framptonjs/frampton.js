import isNumber from 'frampton-utils/is_number';
import isBoolean from 'frampton-utils/is_boolean';
import isString from 'frampton-utils/is_string';

/**
 * Returns true/false is the value a primitive value
 *
 * @name isPrimitive
 * @method
 * @memberof Frampton.Utils
 * @param {*} obj
 * @returns {Boolean}
 */
export default function is_primitive(obj) {
  return (
    isNumber(obj) ||
    isBoolean(obj) ||
    isString(obj)
  );
}