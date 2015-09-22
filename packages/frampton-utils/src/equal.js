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

  var depth = 0;
  var original1 = obj1;
  var original2 = obj2;

  function _equal(obj1, obj2) {

    depth++;

    if (
      // If we're dealing with a circular reference, return reference equality.
      !(depth > 1 && original1 === obj1 && original2 === obj2) &&
      (isObject(obj1) || isArray(obj1)) &&
      (isObject(obj2) || isArray(obj2))
    ) {

      var key = null;

      for (key in obj1) {
        if (!obj2 || !_equal(obj1[key], obj2[key])) {
          return false;
        }
      }

      return true;

    } else {
      return (obj1 === obj2);
    }
  }

  return _equal(obj1, obj2);
}