import curry from 'frampton-utils/curry';
import forEach from 'frampton-record/for_each';

export default curry(function curried_filter(fn, obj) {

  const newObj = {};

  forEach((value, key) => {
    if (fn(value, key)) {
      newObj[key] = value;
    }
  }, obj);

  return Object.freeze(newObj);
});