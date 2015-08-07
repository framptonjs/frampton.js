import curry from 'frampton-utils/curry';

export default curry(function apply_styles(element, props) {
  for (let key in props) {
    element.style.setProperty(key, props[key], '');
  }
});