import curry from 'frampton-utils/curry';

/**
 * @name prepend
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 * @param {*} obj
 */
export default curry(function(xs, obj) {
  return Object.freeze([].concat(obj).concat(xs));
});