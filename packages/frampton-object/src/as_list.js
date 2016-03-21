import reduce from 'frampton-object/reduce';

// as_list :: Object -> Array [String, *]
export default function(map) {
  return Object.freeze(reduce((acc, nextValue, nextKey) => {
    acc.push([nextKey, nextValue]);
    return acc;
  }, [], map));
}