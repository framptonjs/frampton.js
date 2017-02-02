import length from 'frampton-list/length';

/**
 * @name removeIndex
 * @method
 * @memberof Frampton.List
 * @param {Number} index
 * @param {Array} xs
 * @returns {Array} A new array
 */
export default function remove_index(index, xs) {

  const len = length(xs);
  const newList = [];

  for (let i = 0; i < len; i++) {
    if (i !== index) {
      newList.push(xs[i]);
    }
  }

  return newList;
}
