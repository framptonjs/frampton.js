import curry from 'frampton-utils/curry';
import forEach from 'frampton-object/for_each';

/**
 * @name filter
 * @method
 * @memberof Frampton.Object
 * @param {Function} predicate A function to filter the object. The functino recieves the
 * value and key as arguments to make its decision
 * @returns {Object}
 */
export default curry(function curried_filter(predicate, obj) {

  const newObj = {};

  forEach((value, key) => {
    if (predicate(value, key)) {
      newObj[key] = value;
    }
  }, obj);

  return newObj;
});
