import curry from 'frampton-utils/curry';
import get from 'frampton-utils/get';
import { Maybe } from 'frampton-data/maybe';

/**
 * safeGet :: String -> Object -> Maybe Any
 *
 * @name safeGet
 * @method
 * @memberof Frampton.Utils
 * @param {String} prop
 * @param {Object} obj
 * @returns {Frampton.Data.Maybe}
 */
export default curry(function safe_get(prop, obj) {
  return Maybe.of(get(prop, obj));
});