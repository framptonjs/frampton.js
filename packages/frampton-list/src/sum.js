import foldl from 'frampton-list/foldl';

/**
 * + sum :: Number a => List a -> a
 *
 * @name sum
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 */
export default function sum(xs) {
  return foldl((acc, next) => {
    return (acc + next);
  }, 0, xs);
}