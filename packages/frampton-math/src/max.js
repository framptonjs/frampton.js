import curry from 'frampton-utils/curry';

export default curry(function(l, r) {
  return (l > r) ? l : r;
});