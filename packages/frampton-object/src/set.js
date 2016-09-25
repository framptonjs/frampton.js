import curry from 'frampton-utils/curry';
import update from 'frampton-object/update';

/**
 * set :: String -> Any -> Object -> Object
 *
 * @name set
 * @method
 * @memberof Frampton.Object
 * @param {String} key The key to update
 * @param {*} value The value to update to
 * @param {Object} obj The object to update
 * @returns {Object}
 */
export default curry(function set(key, value, obj) {
  const toUpdate = {};
  toUpdate[key] = value;
  return update(obj, toUpdate);
});
