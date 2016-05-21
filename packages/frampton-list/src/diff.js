import curry from 'frampton-utils/curry';
import contains from 'frampton-list/contains';
import each from 'frampton-list/each';

/**
 * @name diff
 * @method
 * @memberof Frampton.List
 * @returns {Array}
 */
export default curry(function curried_diff(xs, ys) {

  const diff = [];

  each((item) => {
    if (!contains(ys, item)) {
      diff.push(item);
    }
  }, xs);

  return Object.freeze(diff);
});
