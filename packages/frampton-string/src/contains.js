import curry from 'frampton-utils/curry';

// contains :: String -> String -> Boolean
export default curry(function contains(sub, str) {
  return (str.indexOf(sub) > -1);
});