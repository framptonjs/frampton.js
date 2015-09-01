import curry from 'frampton-utils/curry';

/**
 * hasLength :: Int -> [a] -> Boolean
 *
 * @name hasLength
 * @memberOf Frampton.Utils
 * @static
 * @param {Number} len
 * @param {Object} obj
 * @returns {Boolean}
 */
export default curry(function has_length(len, obj) {
  return (obj && obj.length && obj.length >= len) ? true : false;
});