import curryN from 'frampton-utils/curry_n';

/**
 * @name each
 * @method
 * @memberof Frampton.List
 * @param {Functino} fn Function to run on each element
 * @param {Array} xs Array to
 */
export default curryN(2, function curried_each(fn, xs) {
  const len = xs.length;
  for (let i = 0; i < len; i++) {
    fn(xs[i], i);
  }
});
