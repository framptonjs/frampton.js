import length from 'frampton-list/length';

/**
 * @name copy
 * @method
 * @memberof Frampton.List
 */
export default function copy(xs, begin, end) {

  const argLen = length(xs);
  var idx = 0;
  var arr;

  begin = (begin || 0);
  end = (end || argLen);
  const arrLen = (end - begin);

  if (argLen > 0) {
    arr = new Array(arrLen);
    for (let i = begin; i < end; i++) {
      arr[idx++] = xs[i];
    }
  }

  return Object.freeze(arr || []);
}
