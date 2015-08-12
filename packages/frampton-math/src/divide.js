import curry from 'frampton-utils/curry';

// divide :: Number -> Number -> Number
export default curry(function divide(a, b) {
  return a / b;
});