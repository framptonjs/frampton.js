import curry from 'frampton-utils/curry';

/**
 * split :: Number -> List a -> (List a, List a)
 *
 * @name split
 * @method
 * @memberof Frampton.List
 */
export default curry(function split(n, xs) {
  var ys = [];
  var zs = [];
  var len = xs.length;

  for (let i=0;i<len;i++) {
    if (i < n) {
      ys.push(xs[i]);
    } else {
      zs.push(xs[i]);
    }
  }

  return [ys, zs];
});