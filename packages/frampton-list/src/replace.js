import curryN from 'frampton-utils/curry_n';
import find from 'frampton-list/find';
import replaceIndex from 'frampton-list/replace_index';

export default curryN(2, function replace(oldObj, newObj, xs) {
  const index = find(oldObj, xs);
  if (index > -1) {
    return replaceIndex(index, newObj, xs);
  } else {
    return xs;
  }
});
