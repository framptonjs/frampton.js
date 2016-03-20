/**
 * @name copy
 * @method
 * @memberof Frampton.List
 */
export default function copy(xs, begin, end) {

  var argLen = xs.length,
      idx    = 0,
      arrLen, arr, i;

  begin = (begin || 0);
  end = (end || argLen);
  arrLen = (end - begin);

  if (argLen > 0) {
    arr = new Array(arrLen);
    for (i=begin;i<end;i++) {
      arr[idx++] = xs[i];
    }
  }

  return Object.freeze(arr || []);
}