import foldl from 'frampton-list/foldl';

/**
 * @name product
 * @param {Array} xs
 */
export default function product(xs) {
  foldl((acc, next) => {
    return (acc = (acc * next));
  }, 0, xs);
}