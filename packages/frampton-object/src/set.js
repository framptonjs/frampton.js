import curry from 'frampton-utils/curry';
import isString from 'frampton-utils/is_string';
import getKeys from 'frampton-object/keys';

function setValue(prop, value, oldObj, newObj) {
  if (!isString(prop)) {
    throw new Error('Property to set must be a string');
  } else {
    const [ head, ...tail ] = (prop || '').split('.').filter((val) => {
      return val.trim() !== '';
    });

    const keys = getKeys(oldObj);

    if (keys.indexOf(head) === -1) {
      keys.push(head);
    }

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key === head) {
        if (tail.length > 0) {
          const nextObj = oldObj[key] || {};
          newObj[key] = setValue(tail.join('.'), value, nextObj, {});
        } else {
          newObj[key] = value;
        }
      } else {
        newObj[key] = oldObj[key];
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
