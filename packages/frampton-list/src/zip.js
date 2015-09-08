import curry from 'frampton-utils/curry';

/**
 * zip :: List a -> List b - List (a, b)
 *
 * @name zip
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 * @param {Array} ys
 */
export default curry(function(xs, ys) {

  var xLen = xs.length;
  var yLen = ys.length;
  var len  = (xLen > yLen) ? yLen : xLen;
  var zs   = new Array(len);
  var i    = 0;

  for (;i<len;i++) {
    zs[i] = [xs[i], ys[i]];
  }

  return zs;
});