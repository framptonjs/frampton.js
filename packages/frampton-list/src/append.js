import curryN from 'frampton-utils/curry_n';

/**
 * @name append
 * @method
 * @memberof Frampton.List
 * @param {Array} xs
 * @param {*} obj
 * @returns {Array}
 */
export default curryN(2, (xs, obj) => [ ...xs, obj ]);
