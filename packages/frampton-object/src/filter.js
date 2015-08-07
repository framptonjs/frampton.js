import curry from 'frampton-utils/curry';
import forEach from 'frampton-object/for_each';

export default curry(function curried_filter(fn, obj) {

  var newObj = {};

  forEach((value, key) => {
    if (fn(value, key)) {
      newObj[key] = value;
    }
  }, obj);

  return newObj;
});