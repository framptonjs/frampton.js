import foldr from 'frampton-list/foldr';

/**
 * + reverse :: List a -> List a
 *
 * @name reverse
 * @memberOf Frampton
 * @static
 */
export default function reverse(xs) {
  return foldr((acc, next) => {
    acc.push(next);
    return acc;
  }, [], xs);
}