import curry from 'frampton-utils/curry';
import isSomething from 'frampton-utils/is_something';
import length from 'frampton-list/length';

/**
 * @name append
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 * @param {*} obj
 * @returns {Array}
 */
export default curry(function(xs, obj) {
  if (isSomething(obj)) {
    const len = length(xs);
    const newArray = new Array((len + 1));
    for (let i = 0; i < len; i++) {
      newArray[i] = xs[i];
    }
    newArray[len] = obj;
    return Object.freeze(newArray);
  } else {
    return xs;
  }
});