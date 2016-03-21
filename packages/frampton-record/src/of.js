import copy from 'frampton-record/copy';

/**
 * of :: Object -> Object
 *
 * @name of
 * @method
 * @memberof Frampton.Record
 * @param {Object} obj object to copy
 * @returns {Object}
 */
export default function of_record(obj) {
  return copy(obj);
}