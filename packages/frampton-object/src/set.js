import curry from 'frampton-utils/curry';
import isString from 'frampton-utils/is_string';

function setValue(prop, value, oldObj, newObj) {
  if (!isString(prop)) {
    throw new Error('Property to set must be a string');
  } else {
    const parts = (prop || '').split('.').filter((val) => {
      return val.trim() !== '';
    });

    if (parts.length > 1) {
      const [head, ...tail] = parts;
      if (!newObj[head]) {
        newObj[head] = {};
      }
      newObj[head] = setValue(tail.join('.'), value, oldObj, newObj[head]);
    } else {
      newObj[parts[0]] = value;
    }
  }

  return newObj;
}

/**
 * set :: String -> Any -> Object -> Object
 *
 * @name set
 * @method
 * @memberof Frampton.Object
 * @param {String} key The key to update
 * @param {*} value The value to update to
 * @param {Object} obj The object to update
 * @returns {Object}
 */
export default curry(function set(prop, value, obj) {
  const newObj = {};
  for (let key in obj) {
    newObj[key] = obj[key];
  }
  return setValue(prop, value, obj, newObj);
});
