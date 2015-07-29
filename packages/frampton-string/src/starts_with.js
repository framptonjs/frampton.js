import curry from 'frampton-utils/curry';

// starts_with :: String -> String -> Boolean
export default curry(function starts_with(sub, str) {
  return (str.indexOf(sub) === 0);
});