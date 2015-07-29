import curry from 'frampton-utils/curry';

// ends_with :: String -> String -> Boolean
export default curry(function ends_with(sub, str) {
  return ((str.length >= sub.length) &&
          (str.lastIndexOf(sub) === str.length - sub.length));
});