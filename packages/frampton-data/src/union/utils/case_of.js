import Frampton from 'frampton/namespace';
import isSomething from 'frampton-utils/is_something';
import isNothing from 'frampton-utils/is_nothing';
import validateParent from 'frampton-data/union/utils/validate_parent';
import validateOptions from 'frampton-data/union/utils/validate_options';
import wildcard from 'frampton-data/union/utils/wildcard';

function getMatch(child, cases) {
  const match = cases[child.ctor];
  if (isSomething(match)) {
    return match;
  } else {
    return cases[wildcard];
  }
}

/**
 * @name caseOf
 * @memberof Frampton.Data.Union
 * @param {Object} parent
 * @param {Object} cases
 * @param {Frampton.Data.Union} child
 * @returns {*}
 */
export default function case_of(parent, cases, child) {

  // In dev mode we validate types
  // In prod we pray because we're screwed anyway
  if (!Frampton.isProd()) {
    validateParent(parent, child);
    validateOptions(parent, cases);
  }

  const match = getMatch(child, cases);

  if (isNothing(match)) {
    throw new Error('No match for value with name: ' + child.ctor);
  }

  // Destructure arguments for passing to callback
  return match(...(child._values));
}
