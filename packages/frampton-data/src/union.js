/**

This implementation is largely taken from Simon Friis Vindum
https://github.com/paldepind/union-type

The MIT License (MIT)

Copyright (c) 2015 Simon Friis Vindum

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

import assert from 'frampton-utils/assert';
import curryN from 'frampton-utils/curry_n';
import isString from 'frampton-utils/is_string';
import isNumber from 'frampton-utils/is_number';
import isBoolean from 'frampton-utils/is_boolean';
import isObject from 'frampton-utils/is_object';
import isFunction from 'frampton-utils/is_function';
import isArray from 'frampton-utils/is_array';

var mapConstrToFn = function(group, constr) {
  return constr === String    ? isString
       : constr === Number    ? isNumber
       : constr === Boolean   ? isBoolean
       : constr === Object    ? isObject
       : constr === Array     ? isArray
       : constr === Function  ? isFunction
       : constr === undefined ? group
                              : constr;
};

function Constructor(group, name, validators) {
  return curryN(validators.length, function() {
    var val = [], validator, i, v;
    for (i = 0; i < arguments.length; ++i) {
      v = arguments[i];
      validator = mapConstrToFn(group, validators[i]);
      if ((typeof validator === 'function' && validator(v)) ||
          (v !== undefined && v !== null && v.of === validator)) {
        val[i] = v;
      } else {
        throw new TypeError('wrong value ' + v + ' passed to location ' + i + ' in ' + name);
      }
    }
    val.of = group;
    val.name = name;
    return val;
  });
}

function rawCase(type, cases, action, arg) {
  assert('wrong type passed to case', (type === action.of));
  var name = action.name in cases ? action.name
           : '_' in cases         ? '_'
                                  : undefined;
  if (name === undefined) {
    throw new Error('unhandled value passed to case');
  } else {
    return cases[name].apply(undefined, arg !== undefined ? action.concat([arg]) : action);
  }
}

var typeCase = curryN(3, rawCase);
var caseOn = curryN(4, rawCase);

/**
 * @name Union
 * @class
 * @memberof Frampton.Data
 * @param {Object} dex
 * @returns {Object}
 */
function Union(desc) {
  var obj = {};
  for (var key in desc) {
    obj[key] = Constructor(obj, key, desc[key]);
  }
  obj.case = typeCase(obj);
  obj.caseOn = caseOn(obj);
  return obj;
}

export default Union;