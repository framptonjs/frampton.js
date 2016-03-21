import curry from 'frampton-utils/curry';

export default curry(function curried_for_each(fn, obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn(obj[key], key);
    }
  }
});