import curry from 'frampton-utils/curry';

export default curry(function curried_contains(element, evt) {
  var target = evt.target;
  return (isSomething(target) && isSomething(element) && (element === target || element.contains(target)));
});