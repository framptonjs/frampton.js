import curry from 'frampton-utils/curry';

/**
 * @name cons
 * @param {Any} obj
 * @param {Array} xs
 */
export default curry(function(obj, ys) {
  return [].concat(obj).concat(ys);
});