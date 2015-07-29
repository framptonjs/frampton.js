import isObject from 'frampton-utils/is_object';
import isArray from 'frampton-utils/is_array';

export default function(obj1, obj2) {

  if ((isObject(obj1) || isArray(obj1)) && (isObject(obj1) || isArray(obj1))) {

    var key = null;

    for (key in obj1) {
      if (obj2[key] !== obj1[key]) {
        return false;
      }
    }

    return true;

  } else {
    return (obj1 === obj2);
  }
}