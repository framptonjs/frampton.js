import curryN from 'frampton-utils/curry_n';
import toBoolean from 'frampton-utils/to_boolean';

/**
 * not :: Function -> a -> Boolean
 *
 * @name not
 * @method
 * @memberof Frampton.Utils
 * @param {Function} fn
 * @returns {Boolean}
 */
export default curryN(2, (fn, arg) => !(toBoolean(fn(arg))));
