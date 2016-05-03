import curry from 'frampton-utils/curry';
import get from 'frampton-utils/get';
import isSomething from 'frampton-utils/is_something';

export default curry(function(prop, obj) {
  return isSomething(get(prop, obj));
});