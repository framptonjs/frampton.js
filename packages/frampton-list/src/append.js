import curry from 'frampton-utils/curry';

/**
 * @name append
 * @param {Array} xs
 * @param {Any} obj
 */
export default curry(function(xs, obj) {
  return xs.concat([].concat(obj));
});