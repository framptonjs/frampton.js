import curry from 'frampton-utils/curry';

/**
 * @name prepend
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 * @param {*} obj
 */
export default curry(function(xs, obj) {
  return [].concat(obj).concat(xs);
});