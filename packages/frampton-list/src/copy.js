/**
 * @name copy
 * @memberOf Frampton
 */
export default function(args, begin, end) {

  var argLen = args.length,
      arrLen = 0,
      idx    = 0,
      arr, i;

  begin = (begin || 0);
  end = (end || argLen);
  arrLen = (end - begin);

  if (argLen > 0) {
    arr = new Array(arrLen);
    for (i=begin;i<end;i++) {
      arr[idx++] = args[i];
    }
  }

  return arr || [];
}