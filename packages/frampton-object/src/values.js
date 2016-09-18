import isObject from 'frampton-utils/is_object';

const hasOwnProp = Object.prototype.hasOwnProperty;

/**
 * @name values
 * @method
 * @memberof Frampton.Object
 * @param {Object} obj Object whose values to get
 * @returns {String[]}
 */
export default function values(obj) {
  const result = [];
  if (isObject(obj)) {
    for (let key in obj) {
      if (hasOwnProp.call(obj, key)) {
        result.push(obj[key]);
      }
    }
  }
  return result;
}
