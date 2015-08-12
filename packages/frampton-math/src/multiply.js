import curry from 'frampton-utils/curry';

// multiply :: Number -> Number -> Number
export default curry(function multiply(a, b) {
  return a * b;
});