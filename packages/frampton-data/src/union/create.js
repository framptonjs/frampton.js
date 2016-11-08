import curryN from 'frampton-utils/curry_n';
import keys from 'frampton-object/keys';
import createType from 'frampton-data/union/utils/create_type';
import caseOf from 'frampton-data/union/utils/case_of';
import validateTypes from 'frampton-data/union/utils/validate_types';

/**

  const Action = Union({
    Foo : ['name', 'id'],
    Bar : ['id', 'description']
  });

  const foo = Action.Foo('test', 89);

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
  const children = keys(values);
  validateTypes(children);

  parent.ctor = 'Frampton.Data.Union';
  parent.children = children;
  parent.match = curryN(3, caseOf, parent);

  for (let name in values) {
    parent[name] = createType(name, values[name]);
  }

  return Object.freeze(parent);
}
