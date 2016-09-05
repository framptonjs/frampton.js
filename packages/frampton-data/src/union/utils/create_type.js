import warn from 'frampton-utils/warn';
import curryN from 'frampton-utils/curry_n';
import validateNames from 'frampton-data/union/utils/validate_names';

/**
 * @name createType
 * @memberof Frampton.Data.Union
 * @param {Object} parent
 * @param {String} name
 * @param {Object} fields
 * @returns {Function}
 */
export default function create_type(parent, name, fields) {

  validateNames(fields);
  const len = fields.length;

  const constructor = (...args) => {

    const argLen = args.length;

    if (len !== argLen) {
      warn(`Frampton.Data.Union.${name} expected ${len} arguments but received ${argLen}.`);
    }

    const child = [];
    child.constructor = parent;
    child.ctor = name;
    child._values = args;

    for (let i = 0; i < argLen; i++) {
      child[fields[i]] = args[i];
    }

    return Object.freeze(child);
  };

  return (len === 0) ? constructor : curryN(len, constructor);
}
