import curry from 'frampton-utils/curry';
import contains from 'frampton-list/contains';

/**
 * @name diff
 * @method
 * @memberof Frampton.List
 * @returns {Array}
 */
export default curry(function curried_diff(xs, ys) {

  var diff = [];

  xs.forEach((item) => {
    if (!contains(ys, item)) {
      diff.push(item);
    }
  });

  return diff;
});