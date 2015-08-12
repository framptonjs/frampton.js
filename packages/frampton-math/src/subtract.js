import curry from 'frampton-utils/curry';

// subtract :: Number -> Number -> Number
export default curry(function subtract(a, b) {
  return (a - b);
});