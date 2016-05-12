import curryN from 'frampton-utils/curry_n';

export default curryN(2, function always(fn, ...args) {
  return function() {
    return fn.apply(null, args);
  };
});