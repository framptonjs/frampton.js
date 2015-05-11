import { curry } from 'frampton-utils';
import forEach from 'frampton-object/for_each';

export default curry(function curried_map(fn, obj) {

  var newObj = {};

  forEach(function(value, key) {
    newObj[key] = fn(value, key);
  }, obj);

  return newObj;
});