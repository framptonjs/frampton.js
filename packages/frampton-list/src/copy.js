/**
 * @name copy
 * @memberOf Frampton
 */
export default function(xs) {

  var len = xs.length;
  var arr = new Array(len);

  for (let i = 0; i < len; i++) {
    arr[i] = xs[i];
  }

  return arr;
}