import curryN from 'frampton-utils/curry_n';

/**
 * @name map
 * @method
 * @memberof Frampton.Utils
 * @param {Function} fn - The function to apply to the array
 * @param {Array} xs - The array to apply the mapping function to
 * @returns {Array} A new array transfomred by the mapping function
 */
export default curryN(2, (fn, xs) => xs.map(fn));
