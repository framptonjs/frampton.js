import curryN from 'frampton-utils/curry_n';

export default curryN(2, function(obj, xs) {
  return xs.indexOf(obj);
});
