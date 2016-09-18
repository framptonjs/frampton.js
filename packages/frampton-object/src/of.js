import copy from 'frampton-object/copy';

/**
 * of :: Object -> Object
 *
 * @name of
 * @method
 * @memberof Frampton.Object
 * @param {Object} obj object to copy
 * @returns {Object}
 */
export default function of_record(obj) {
  return copy(obj);
}
