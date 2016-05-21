import foldl from 'frampton-list/foldl';
import isNothing from 'frampton-utils/is_nothing';

/**
 * @name maximum
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 */
export default function maximum(xs) {
  return foldl((acc, next) => {
    if (isNothing(acc) || next > acc) {
      acc = next;
    }
    return acc;
  }, null, xs);
}