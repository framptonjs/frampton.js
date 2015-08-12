import curry from 'frampton-utils/curry';

// add :: Number -> Number -> Number
export default curry(function add(a, b) {
  return a + b;
});