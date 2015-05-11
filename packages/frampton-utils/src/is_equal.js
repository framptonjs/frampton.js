import curry from 'frampton-utils/curry';

export default curry(function is_equal(a, b) {
  return (a === b);
});