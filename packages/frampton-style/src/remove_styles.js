import curry from 'frampton-utils/curry';

export default curry(function remove_styles(element, props) {
  for (let key in props) {
    element.style.removeProperty(key);
  }
});