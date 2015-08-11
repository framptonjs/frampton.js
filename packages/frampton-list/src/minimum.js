import foldl from 'frampton-list/foldl';
import isNothing from 'frampton-utils/is_nothing';

/**
 * @name minimum
 * @param {Array} xs
 */
export default function minimum(xs) {
  return foldl((acc, next) => {
    if (isNothing(acc) || next < acc) {
      acc = next;
    }
    return acc;
  }, null, xs);
}