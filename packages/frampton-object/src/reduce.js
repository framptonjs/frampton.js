import curry from 'frampton-utils/curry';
import forEach from 'frampton-object/for_each';

/**
 * reduce :: Function -> Any -> Object -> Object
 *
 * @name reduce
 * @method
 * @memberof Frampton.Object
 * @param {Function} fn Function used to reduce the object
 * @param {*} acc Initial value of reduce operation
 * @param {Object} obj Object to iterate over for the reduce
 * @returns {*}
 */
export default curry(function curried_reduce(fn, acc, obj) {

  forEach((value, key) => {
    acc = fn(acc, value, key);
  }, obj);

  return acc;
});
