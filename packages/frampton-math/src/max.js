import curry from 'frampton-utils/curry';

export default curry(function(a, b) {
  return (a > b) ? a : b;
});