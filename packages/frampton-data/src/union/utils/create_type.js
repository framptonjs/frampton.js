import warn from 'frampton-utils/warn';
import curryN from 'frampton-utils/curry_n';
import isString from 'frampton-utils/is_string';
import toString from 'frampton-data/union/utils/to_string';
import validateNames from 'frampton-data/union/utils/validate_names';

/**
 * @name createType
 * @memberof Frampton.Data.Union
 * @param {String} name
 * @param {Object} fields
 * @returns {Function}
 */
export default function create_type(name, fields) {

  validateNames(fields);
  const len = fields.length;

  const constructor = (...args) => {

    const argLen = args.length;

    if (len !== argLen) {
      warn(`Frampton.Data.Union.${name} expected ${len} arguments but received ${argLen}.`);
    }

    const child = {};
    child.ctor = name;
    child.toString = toString;
    child._values = args;

    for (let i = 0; i < argLen; i++) {
      let field = fields[i];
      if (isString(field)) {
        child[field] = args[i];
      } else {
        warn(`Frampton.Data.Union.${name} received argument without associated field.`);
      }
    }

    return Object.freeze(child);
  };

  return (len === 0) ? constructor : curryN(len, constructor);
}
