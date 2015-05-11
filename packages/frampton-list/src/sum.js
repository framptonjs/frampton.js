import foldl from 'frampton-list/foldl';

/**
 * + sum :: Number a => List a -> a
 * @name sum
 * @param {Array} xs
 */
export default function sum(xs) {
  foldl((acc, next) => {
    return (acc = (acc + next));
  }, 0, xs);
}