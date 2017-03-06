import isObject from 'frampton-utils/is_object';
import getKeys from 'frampton-object/keys';

/**
 * update :: Object -> Object -> Object
 *
 * @name update
 * @method
 * @memberof Frampton.Object
 * @param {Object} base   object to copy
 * @param {Object} update object describing desired udpate
 * @returns {Object}
 */
export default function update_object(base, update) {

  const newObj = {};
  const baseKeys = getKeys(base);
  const updateKeys = getKeys(update);

  for (let i = 0; i < updateKeys.length; i++) {
    const key = updateKeys[i];
    if (baseKeys.indexOf(key) === -1) {
      baseKeys.push(key);
    }
  }

  for (let i = 0; i < baseKeys.length; i++) {
    const key = baseKeys[i];
    const baseValue = base[key];
    const updateValue = update[key];
    if (isObject(baseValue) && isObject(updateValue)) {
      newObj[key] = update_object(baseValue, updateValue);
    } else if (updateValue !== undefined) {
      newObj[key] = updateValue;
    } else {
      newObj[key] = baseValue;
    }
  }

  return newObj;
}
