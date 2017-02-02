import curryN from 'frampton-utils/curry_n';
import length from 'frampton-list/length';

export default curryN(2, function replace_index(index, obj, xs) {
  const len = length(xs);
  const newArray = new Array(len);
  for (let i = 0; i < len; i++) {
    if (i === index) {
      newArray[i] = obj;
    } else {
      newArray[i] = xs[i];
    }
  }
  return newArray;
});
