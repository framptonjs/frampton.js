import { curry } from 'frampton-utils';
import forEach from 'frampton-object/for_each';

export default curry(function curried_reduce(fn, acc, obj) {

  forEach(function(value, key) {
    acc = fn(acc, value, key);
  }, obj);

  return acc;
});