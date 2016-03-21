import curry from 'frampton-utils/curry';
import forEach from 'frampton-record/for_each';

export default curry(function curried_reduce(fn, acc, obj) {

  forEach((value, key) => {
    acc = fn(acc, value, key);
  }, obj);

  return acc;
});