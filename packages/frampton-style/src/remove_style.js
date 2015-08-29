import curry from 'frampton-utils/curry';
import supported from 'frampton-style/supported';

export default curry(function remove_style(element, key) {
  element.style.removeProperty(supported(key));
});