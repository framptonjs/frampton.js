import curry from 'frampton-utils/curry';

/**
 * @name prepend
 * @param {Array} xs
 * @param {Any} obj
 */
export default curry(function(xs, obj) {
  return [].concat(obj).concat(xs);
});