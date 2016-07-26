import curryN from 'frampton-utils/curry_n';

/**
 * @name filter
 * @memberof Frampton.Utils
 * @method
 * @param {Function} predicate
 * @param {Array} xs
 * @returns {*}
 */
export default curryN(2, (predicate, xs) => xs.filter(predicate));
