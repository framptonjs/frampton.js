import curry from 'frampton-utils/curry';
import isSomething from 'frampton-utils/is_something';

export default curry(function curried_contains(element, evt) {
  var target = evt.target;
  return (isSomething(target) && isSomething(element) && (element === target || element.contains(target)));
});