import foldl from 'frampton-list/foldl';

/**
 * @name product
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 */
export default function product(xs) {
  return foldl((acc, next) => {
    return (acc * next);
  }, 1, xs);
}