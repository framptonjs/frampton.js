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
  return Object.freeze(xs.concat([].concat(obj)));
});