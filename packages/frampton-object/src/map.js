import curry from 'frampton-utils/curry';
import forEach from 'frampton-object/for_each';

export default curry(function curried_map(fn, obj) {

  var newObj = {};

  forEach((value, key) => {
    newObj[key] = fn(value, key);
  }, obj);

  return newObj;
});