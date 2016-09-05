import isNothing from 'frampton-utils/is_nothing';
import validateOptions from 'frampton-data/union/utils/validate_options';
import getMatch from 'frampton-data/union/utils/get_match';

/**
 * @name caseOf
 * @memberof Frampton.Data.Union
 * @param {Object} parent
 * @param {Object} cases
 * @param {Frampton.Data.Union} child
 * @returns {*}
 */
export default function case_of(parent, cases, child) {

  // Validate we have exhausitve pattern match
  validateOptions(parent, cases);

  const match = getMatch(child, cases);

  if (isNothing(match)) {
    throw new Error(`No match for value with name: ${child.ctor}`);
  } else {
    // Destructure arguments for passing to callback
    return match(...(child._values));
  }
}
