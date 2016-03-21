import curry from 'frampton-utils/curry';
import forEach from 'frampton-record/for_each';

export default curry(function curried_map(fn, obj) {

  const newObj = {};

  forEach((value, key) => {
    newObj[key] = fn(value, key);
  }, obj);

  return Object.freeze(newObj);
});