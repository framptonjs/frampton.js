import curry from 'frampton-utils/curry';
import isObject from 'frampton-utils/is_object';
import objectValidator from 'frampton-data/union/utils/object_validator';

/**
 * Is the given parent the actual parent of the given child?
 */
export default curry(function validate_parent(parent, child) {
  if (!objectValidator(parent, child)) {
    if (isObject(child) && child.ctor) {
      throw new TypeError(
        `Frampton.Data.Union.caseOf received unrecognized type: ${child.ctor}`
      );
    } else {
      throw new TypeError(
        'Frampton.Data.Union.caseOf received unrecognized type'
      );
    }
  }
});
