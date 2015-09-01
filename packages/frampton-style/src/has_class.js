import curry from 'frampton-utils/curry';

export default curry(function has_class(element, name) {
  return element.classList.contains(name);
});