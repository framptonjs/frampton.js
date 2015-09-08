import foldl from 'frampton-list/foldl';

/**
 * @name product
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 */
export default function product(xs) {
  foldl((acc, next) => {
    return (acc = (acc * next));
  }, 0, xs);
}