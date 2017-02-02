import curryN from 'frampton-utils/curry_n';
import contains from 'frampton-list/contains';
import each from 'frampton-list/each';

/**
 * @name diff
 * @method
 * @memberof Frampton.List
 * @returns {Array}
 */
export default curryN(2, function curried_diff(xs, ys) {

  const diff = [];

  each((item) => {
    if (!contains(ys, item)) {
      diff.push(item);
    }
  }, xs);

  return diff;
});
