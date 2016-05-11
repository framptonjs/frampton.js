import curry from 'frampton-utils/curry';
import find from 'frampton-list/find';
import replaceIndex from 'frampton-list/replace_index';

export default curry(function replace(oldObj, newObj, xs) {
  const index = find(oldObj, xs);
  if (index > -1) {
    return replaceIndex(index, newObj, xs);
  } else {
    return xs;
  }
});