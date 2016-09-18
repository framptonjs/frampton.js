import isFunction from 'frampton-utils/is_function';

const hasOwnProp = Object.prototype.hasOwnProperty;

function getKeys(obj) {
  const result = [];
  for (let key in obj) {
    if (hasOwnProp.call(obj, key)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * @name keys
 * @method
 * @memberof Frampton.Object
 * @param {Object} obj Object whose keys to get
 * @returns {String[]}
 */
export default function keys(obj) {
  if (isFunction(Object.keys)) {
    return Object.keys(obj).filter((key) => {
      return hasOwnProp.call(obj, key);
    });
  } else {
    return getKeys(obj);
  }
}
