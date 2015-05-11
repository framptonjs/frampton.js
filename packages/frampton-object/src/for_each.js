import { curry } from 'frampton-utils';

export default curry(function curried_for_each(fn, obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn(obj[key], key);
    }
  }
});