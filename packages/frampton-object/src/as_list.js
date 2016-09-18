import reduce from 'frampton-object/reduce';

// as_list :: Object -> Array [String, *]
/**
 * @name as_list
 * @method
 * @memberof Frampton.Record
 * @param {Object} obj Object to transform
 * @returns {Array}
 */
export default function as_list(obj) {
  return Object.freeze(reduce((acc, nextValue, nextKey) => {
    acc.push([nextKey, nextValue]);
    return acc;
  }, [], obj));
}
