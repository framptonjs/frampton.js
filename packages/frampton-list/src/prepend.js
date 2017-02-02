import curryN from 'frampton-utils/curry_n';

/**
 * @name prepend
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 * @param {*} obj
 */
export default curryN(2, (obj, xs) => [ obj, ...xs ]);
