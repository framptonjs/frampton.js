import curry from 'frampton-utils/curry';

/**
 * @name forEach
 * @method
 * @memberof Frampton.Object
 * @param {Function} fn Function to call for each key/value pair
 * @param {Object} obj Object to iterate over
 */
export default curry(function curried_for_each(fn, obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn(obj[key], key);
    }
  }
});
