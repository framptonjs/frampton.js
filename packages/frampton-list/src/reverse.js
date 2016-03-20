import foldr from 'frampton-list/foldr';

/**
 * reverse :: List a -> List a
 *
 * @name reverse
 * @method
 * @memberof Frampton.List
 */
export default function reverse(xs) {
  return Object.freeze(foldr((acc, next) => {
    acc.push(next);
    return acc;
  }, [], xs));
}