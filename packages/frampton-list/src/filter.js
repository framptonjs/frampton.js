import curry from 'frampton-utils/curry';

/**
 * @name filter
 * @memberOf Frampton
 * @static
 */
export default curry(function(predicate, xs) {
  return xs.filter(predicate);
});