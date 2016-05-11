import curry from 'frampton-utils/curry';
import isObject from 'frampton-utils/is_object';
import objectValidator from 'frampton-data/union/object_validator';

export default curry(function validate_case(parent, child) {
  if (!objectValidator(parent, child)) {
    if (isObject(child) && child.ctor) {
      throw new TypeError('Match received unrecognized type: ' + child.ctor);
    } else {
      throw new TypeError('Match received unrecognized type');
    }
  }
});