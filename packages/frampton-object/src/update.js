import forEach from 'frampton-object/for_each';

/**
 * update :: Object -> Object -> Object
 *
 * @name update
 * @method
 * @memberof Frampton.Object
 * @param {Object} base   object to copy
 * @param {Object} update object describing desired udpate
 * @returns {Object}
 */
export default function update_object(base, update) {

  const newObj = {};

  forEach((value, key) => {
    if (update[key] !== undefined) {
      newObj[key] = update[key];
    } else {
      newObj[key] = value;
    }
  }, base);

  return Object.freeze(newObj);
}
