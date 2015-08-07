import curry from 'frampton-utils/curry';

export default curry(function add_class(element, name) {
  return element.classList.contains(name);
});