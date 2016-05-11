import curry from 'frampton-utils/curry';
import length from 'frampton-list/length';

export default curry(function replace_index(index, obj, xs) {
  const len = length(xs);
  const newArray = new Array(len);
  for (let i = 0; i < len; i++) {
    if (i === index) {
      newArray[i] = obj;
    } else {
      newArray[i] = xs[i];
    }
  }
  return Object.freeze(newArray);
});