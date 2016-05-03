import log from 'frampton-utils/log';
import curryN from 'frampton-utils/curry_n';
import isBoolean from 'frampton-utils/is_boolean';
import isArray from 'frampton-utils/is_array';
import isNumber from 'frampton-utils/is_number';
import isString from 'frampton-utils/is_string';
import isFunction from 'frampton-utils/is_function';
import isNode from 'frampton-utils/is_node';
import isNothing from 'frampton-utils/is_nothing';
import isObject from 'frampton-utils/is_object';
import isUndefined from 'frampton-utils/is_undefined';
import getKeys from 'frampton-record/keys';

const wildcard = '_';

const objectValidator = function(type) {
  return function(obj) {
    return obj.constructor === type;
  };
};

const validator = function(parent, type) {

  switch(type) {
    case String:
      return isString;

    case Number:
      return isNumber;

    case Function:
      return isFunction;

    case Boolean:
      return isBoolean;

    case Array:
      return isArray;

    case Element:
      return isNode;

    case Node:
      return isNode;

    case undefined:
      return objectValidator(parent);

    default:
      return objectValidator(type);
  }

  return false;
};

const validateOptions = function(obj, cases) {
  for (let i = 0; i < obj.keys.length; i++) {
    if (!cases.hasOwnProperty(wildcard) && !cases.hasOwnProperty(obj.keys[i])) {
      log('Warning: non-exhaustive pattern match for case: ', obj.keys[i]);
    }
  }
};

const validateArgs = function(validators, args) {
  for (let i = 0; i < validators.length; i++) {
    if (isUndefined(args[i]) || !validators[i](args[i])) {
      return false;
    }
  }
  return true;
};

const caseOf = function(parent, cases, val) {

  if (!parent.prototype.isPrototypeOf(val)) {
    if (isObject(val) && val.ctor) {
      throw new TypeError('Match received unrecognized type: ' + val.ctor);
    } else {
      throw new TypeError('Match received unrecognized type');
    }
  }

  validateOptions(parent, cases);
  var match = cases[val.ctor];

  if (isNothing(match)) {
    match = cases[wildcard];
  }

  if (isNothing(match)) {
    throw new Error('No match for value with name: ' + val.ctor);
  }

  // Destructure arguments for passing to callback
  return match.apply(null, val.values);
};

const createType = function(parent, name, fields) {

  const len = fields.length;
  const validators = fields.map((field) => {
    return validator(parent, field);
  });

  if (!isArray(fields)) {
    throw new TypeError('Union must receive an array of fields for each type');
  }

  const constructor = (...args) => {
    const obj = Object.create(parent.prototype);
    if (!validateArgs(validators, args)) {
      throw new TypeError('Union type ' + name + ' recieved an unknown argument');
    }
    obj.ctor = name;
    obj.values = args;
    return Object.freeze(obj);
  };

  return (len > 0) ? curryN(len, constructor) : constructor;
};

export { validator };

// Creates constructors for each type described in config
export default function(config) {
  const obj = {};
  const keys = getKeys(config);
  obj.prototype = {};
  obj.ctor = 'Union';
  obj.keys = keys;
  obj.match = curryN(3, caseOf, obj);
  for (let key in config) {
    obj[key] = createType(obj, key, config[key]);
  }
  return Object.freeze(obj);
}