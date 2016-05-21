import curry from 'frampton-utils/curry';
import extend from 'frampton-utils/extend';

/**
 * Merges two objects into one. Priority is given to the keys on the second object.
 *
 * @name merge
 * @method
 * @memberof Frampton.Record
 * @param {Object} obj1 First object to merge
 * @param {Object} obj2 Second object to merge
 * @returns {Object}
 */
export default curry(function curried_merge(obj1, obj2) {
  return Object.freeze(extend({}, obj1, obj2));
});
