import curry from 'frampton-utils/curry';

export default curry((l, r) => {
  return (l < r) ? l : r;
});