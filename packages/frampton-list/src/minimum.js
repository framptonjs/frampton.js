import foldl from 'frampton-list/foldl';

/**
 * @name minimum
 * @param {Array} xs
 */
export default function minimum(xs) {
  foldl((acc, next) => {
    if (!acc || next < acc) return (acc = next);
    return acc;
  }, null, xs);
}