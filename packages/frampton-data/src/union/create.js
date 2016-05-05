import curryN from 'frampton-utils/curry_n';
import isNothing from 'frampton-utils/is_nothing';
import isObject from 'frampton-utils/is_object';
import isArray from 'frampton-utils/is_array';
import getKeys from 'frampton-record/keys';
import validator from 'frampton-data/union/validator';
import validateArgs from 'frampton-data/union/validate_args';
import validateOptions from 'frampton-data/union/validate_options';
import wildcard from 'frampton-data/union/wildcard';

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