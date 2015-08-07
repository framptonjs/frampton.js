import curry from 'frampton-utils/curry';

export default curry(function remove_class(element, name) {
  element.classList.remove(name);
});