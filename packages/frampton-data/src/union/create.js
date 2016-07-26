import curryN from 'frampton-utils/curry_n';
import warn from 'frampton-utils/warn';
import getKeys from 'frampton-record/keys';
import createType from 'frampton-data/union/utils/create_type';
import caseOf from 'frampton-data/union/utils/case_of';

const blacklist = ['ctor', 'children', 'caseOf'];

/**

  const Action = Union({
    Foo : [String, Number],
    Bar : { name : String }
  });

  const foo = Action.Foo('test', 89);

  const bar = Action.Bar({ name : 'test' });

  Action.match({
    Foo : (str, num) => str + num,
    Bar : (name) => `my name is ${name}`
  });

 */

/**
 * Creates constructors for each type described in config
 *
 * @name create
 * @memberof Frampton.Data.Union
 * @param {Object} values
 * @returns {Frampton.Data.Union}
 */
export default function create_union(values) {
  const parent = {};
  const children = getKeys(values);

  parent.prototype = {};
  parent.ctor = 'Frampton.Data.Union';
  parent.children = children;
  parent.match = curryN(3, caseOf, parent);

  for (let name in values) {
    if (blacklist.indexOf(name) === -1) {
      parent[name] = createType(parent, name, values[name]);
    } else {
      warn(`Frampton.Data.Union received a protected key: ${name}`);
    }
  }

  return Object.freeze(parent);
}
