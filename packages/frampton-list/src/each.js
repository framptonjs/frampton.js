import curry from 'frampton-utils/curry';

/**
 * @name each
 * @method
 * @memberof Frampton.List
 */
export default curry(function curried_each(fn, xs) {
  xs.forEach(fn);
});