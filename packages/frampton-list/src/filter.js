import curry from 'frampton-utils/curry';
import length from 'frampton-list/length';

/**
 * @name filter
 * @method
 * @memberof Frampton.List
 * @param {Function} predicate
 * @param {Array} xs
 * @returns {Array} A new array
 */
export default curry(function filter(predicate, xs) {

  const len = length(xs);
  const newList = [];

  for (let i = 0; i < len; i++) {
    if (predicate(xs[i])) {
      newList.push(xs[i]);
    }
  }

  return Object.freeze(newList);
});