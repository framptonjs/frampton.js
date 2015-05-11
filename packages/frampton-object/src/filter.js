import { curry } from 'frampton-utils';
import forEach from 'frampton-object/for_each';

export default curry(function curried_filter(fn, obj) {

  var newObj = {};

  forEach(function(value, key) {
    if (fn(value, key)) {
      newObj[key] = value;
    }
  }, obj);

  return newObj;
});