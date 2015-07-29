import curry from 'frampton-utils/curry';
import supported from 'frampton-style/supported';

export default curry(function set_style(element, key, value) {
  element.style.setProperty(supported(key), value, '');
});