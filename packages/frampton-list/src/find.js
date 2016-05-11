import curry from 'frampton-utils/curry';

export default curry(function(obj, xs) {
  return xs.indexOf(obj);
});