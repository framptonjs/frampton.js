import curryN from 'frampton-utils/curry_n';

/**
 * @name contains
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 * @param {*}   obj
 * @retruns {Boolean}
 */
export default curryN(2, (xs, obj) => {
  return (xs.indexOf(obj) > -1);
});
