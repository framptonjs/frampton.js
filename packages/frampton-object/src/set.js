import curry from 'frampton-utils/curry';
import warn from 'frampton-utils/warn';
import isString from 'frampton-utils/is_string';

function setValue(prop, value, oldObj, newObj) {
  if (!isString(prop)) {
    throw new Error('Property to set must be a string');
  } else {
    const [head, ...tail] = (prop || '').split('.').filter((val) => {
      return val.trim() !== '';
    });

    if (oldObj[head] === undefined) {
      warn(`Frampton.Object.set: the given path ${prop} is not found in given object`);
    } else {
      for (let key in oldObj) {
        if (key === head) {
          if (tail.length > 0) {
            newObj[key] = setValue(tail.join('.'), value, oldObj[key], {});
          } else {
            newObj[key] = value;
          }
        } else {
          newObj[key] = oldObj[key];
        }
      }
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
  return setValue(prop, value, obj, {});
});
