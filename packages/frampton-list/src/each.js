import curry from 'frampton-utils/curry';

/**
 * @name each
 * @memberOf Frampton
 * @static
 */
export default curry(function curried_each(fn, xs) {
  xs.forEach(fn);
});