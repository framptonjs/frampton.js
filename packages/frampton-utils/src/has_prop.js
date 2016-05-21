import curry from 'frampton-utils/curry';
import get from 'frampton-utils/get';
import isSomething from 'frampton-utils/is_something';

/**
 * hasProp :: String -> Object -> Boolean
 *
 * @name hasProp
 * @method
 * @memberof Frampton.Utils
 * @param {String} prop
 * @param {Object} obj
 * @returns {Boolean}
 */
export default curry(function has_prop(prop, obj) {
  return isSomething(get(prop, obj));
});
