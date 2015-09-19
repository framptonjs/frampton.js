import isObject from 'frampton-utils/is_object';
import isArray from 'frampton-utils/is_array';

/**
 * equal :: Object -> Object -> Boolean
 *
 * @name equal
 * @memberof Frampton.Utils
 * @method
 * @param {*} obj1
 * @param {*} obj2
 * @returns {Boolean}
 */
export default function deep_equal(obj1, obj2) {

  if ((isObject(obj1) || isArray(obj1)) && (isObject(obj2) || isArray(obj2))) {

    var key = null;

    for (key in obj1) {
      if (!obj2 || !deep_equal(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;

  } else {
    return (obj1 === obj2);
  }
}