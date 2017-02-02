import curry from 'frampton-utils/curry';
import forEach from 'frampton-object/for_each';

/**
 * @name map
 * @method
 * @memberof Frampton.Object
 * @param {Function} fn Function used to map the object
 * @param {Object} obj Object to map
 * @returns {Object} A new object with its values mapped using the given function
 */
export default curry(function curried_map(fn, obj) {

  const newObj = {};

  forEach((value, key) => {
    newObj[key] = fn(value, key);
  }, obj);

  return newObj;
});
