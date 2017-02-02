import curryN from 'frampton-utils/curry_n';
import contains from 'frampton-list/contains';
import append from 'frampton-list/append';

/**
 * @name addToList
 * @method
 * @memberof Frampton.List
 * @param {Array} xs  Array to add object to
 * @param {*}   obj Object to add to array
 * @returns {Array} A new array with the object added
 */
export default curryN(2, function add_to_list(xs, obj) {
  return ((!contains(xs, obj)) ? append(xs, obj) : xs);
});
