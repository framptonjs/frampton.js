import curry from 'frampton-utils/curry';

/**
 * @name filter
 * @method
 * @memberof Frampton.List
 */
export default curry(function(predicate, xs) {
  return Object.freeze(xs.filter(predicate));
});