import curry from 'frampton-utils/curry';

/**
 * @name append
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 * @param {*} obj
 * @returns {Array}
 */
export default curry(function(xs, obj) {
  return xs.concat([].concat(obj));
});