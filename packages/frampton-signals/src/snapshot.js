import curry from 'frampton-utils/curry';

export default curry(function(behavior, stream) {
  return stream.sample(behavior);
});