import reduce from 'frampton-object/reduce';

// as_list :: Object -> Array [String, String]
export default function(map) {
  return reduce((acc, nextValue, nextKey) => {
    acc.push([nextKey, nextValue]);
    return acc;
  }, [], map);
}