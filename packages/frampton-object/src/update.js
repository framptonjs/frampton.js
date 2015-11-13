import forEach from 'frampton-object/for_each';

/**
 * update :: Object -> String -> Any -> Object
 *
 * @name update
 * @method
 * @memberof Frampton.Object
 * @param {Object} obj object to copy
 * @param {String} k   name of key to update
 * @param {*}      v   value to update key to
 * @returns {Object}
 */
export default function update_object(obj, k, v) {
  var newObj = {};
  forEach((value, key) => {
    if (key === v) {
      newObj[key] = v;
    } else {
      newObj[key] = value;
    }
  }, obj);
  return newObj;
}