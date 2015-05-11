import foldl from 'frampton-list/foldl';

/**
 * @name maximum
 * @param {Array} xs
 */
export default function maximum(xs) {
  foldl((acc, next) => {
    if (!acc || next > acc) return (acc = next);
    return acc;
  }, null, xs);
}