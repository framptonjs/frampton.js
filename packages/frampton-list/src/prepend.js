import curry from 'frampton-utils/curry';

/**
 * @name prepend
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 * @param {*} obj
 */
export default curry(function(xs, obj) {
  const ys = [ obj ];
  const len = xs.length;
  for (let i = 0; i < len; i++) {
    ys.push(xs[i]);
  }
  return Object.freeze(ys);
});
