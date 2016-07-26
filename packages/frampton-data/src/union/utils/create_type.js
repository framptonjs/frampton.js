import Frampton from 'frampton/namespace';
import isArray from 'frampton-utils/is_array';
import isSomething from 'frampton-utils/is_something';
import curryN from 'frampton-utils/curry_n';
import validator from 'frampton-data/union/utils/validator';
import validateArgs from 'frampton-data/union/utils/validate_args';

function getValidators(parent, fields) {
  if (!Frampton.isProd()) {
    return fields.map((field) => {
      return validator(parent, field);
    });
  } else {
    return null;
  }
}

/**
 * @name createType
 * @memberof Frampton.Data.Union
 * @param {Object} parent
 * @param {String} name
 * @param {Object} fields
 * @returns {Function}
 */
export default function create_type(parent, name, fields) {

  if (!isArray(fields)) {
    throw new Error('Union must receive an array of fields for each type');
  }

  const len = fields.length;
  const validators = getValidators(parent, fields);

  const constructor = (...args) => {

    if (isSomething(validators) && !validateArgs(validators, args)) {
      throw new TypeError(
        `Frampton.Data.Union.${name} recieved an unknown argument`
      );
    }

    const child = [];
    const len = args.length;
    child.constructor = parent;
    child.ctor = name;
    child._values = args;

    for (let i = 0; i < len; i++) {
      child[i] = args[i];
    }

    return Object.freeze(child);
  };

  return (len === 0) ? constructor : curryN(len, constructor);
}
