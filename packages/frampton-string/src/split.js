import curry from 'frampton-utils/curry';

// split :: String -> String -> Array String
export default curry(function join(sep, str) {
  return str.split(sep);
});