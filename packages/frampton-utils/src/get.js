import curry from 'frampton-utils/curry';
import warn from 'frampton-utils/warn';
import get from 'frampton-object/get';

/**
 * get :: String -> Object -> Any
 *
 * @name get
 * @method
 * @deprecated
 * @memberof Frampton.Utils
 * @param {String} prop
 * @param {Object} obj
 * @returns {*}
 */
export default curry(function(prop, obj) {
  warn('Frampton.Utils.get is deprecated. Use Frampton.Object.get');
  return get(prop, obj);
});
