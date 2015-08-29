import curry from 'frampton-utils/curry';
import extend from 'frampton-utils/extend';

export default curry(function(obj1, obj2) {
  return extend({}, obj1, obj2);
});