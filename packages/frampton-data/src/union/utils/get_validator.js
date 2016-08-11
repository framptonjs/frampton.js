import isBoolean from 'frampton-utils/is_boolean';
import isArray from 'frampton-utils/is_array';
import isNumber from 'frampton-utils/is_number';
import isString from 'frampton-utils/is_string';
import isFunction from 'frampton-utils/is_function';
import isNode from 'frampton-utils/is_node';
import objectValidator from 'frampton-data/union/utils/object_validator';

export default function get_validator(parent, type) {

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

    case Object:
      return function(obj) {
        return (typeof obj === 'object');
      };

    case undefined:
      return objectValidator(parent);

    default:
      return objectValidator(type);
  }

  return false;
}
