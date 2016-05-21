import foldl from 'frampton-list/foldl';
import isNothing from 'frampton-utils/is_nothing';

/**
 * @name min
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 */
export default function min(xs) {
  return foldl((acc, next) => {
    if (isNothing(acc) || next < acc) {
      acc = next;
    }
    return acc;
  }, null, xs);
}
