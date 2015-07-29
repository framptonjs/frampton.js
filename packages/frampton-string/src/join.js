import curry from 'frampton-utils/curry';

// join :: String -> Array String -> String
export default curry(function join(sep, strs) {
  return strs.join(sep);
});