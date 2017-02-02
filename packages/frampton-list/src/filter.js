import curryN from 'frampton-utils/curry_n';
import length from 'frampton-list/length';

/**
 * @name filter
 * @method
 * @memberof Frampton.List
 * @param {Function} predicate
 * @param {Array} xs
 * @returns {Array} A new array
 */
export default curryN(2, function filter(predicate, xs) {

  const len = length(xs);
  const newList = [];

  for (let i = 0; i < len; i++) {
    if (predicate(xs[i])) {
      newList.push(xs[i]);
    }
  }

  return newList;
});
