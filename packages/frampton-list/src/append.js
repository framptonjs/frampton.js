import curry from 'frampton-utils/curry';

/**
 * @name append
 * @param {Array} xs
 * @param {Any} obj
 * @returns {Array}
 */
export default curry(function(xs, obj) {
  return xs.concat([].concat(obj));
});