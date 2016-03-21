import forEach from 'frampton-record/for_each';

/**
 * copy :: Object -> Object
 *
 * @name copy
 * @method
 * @memberof Frampton.Object
 * @param {Object} obj object to copy
 * @returns {Object}
 */
export default function copy_object(obj) {

  const newObj = {};

  forEach((value, key) => {
    newObj[key] = value;
  }, obj);

  return Object.freeze(newObj);
}