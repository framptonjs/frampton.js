import curry from 'frampton-utils/curry';

/**
 *
 */
export default curry(function(xs, obj) {
  return (xs.indexOf(obj) > -1);
});