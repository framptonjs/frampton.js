import curry from 'frampton-utils/curry';
import supported from 'frampton-style/supported';

/**
 * @name setStyle
 * @method
 * @memberof Frampton.Style
 * @param {Object} element
 * @param {String} key
 * @param {String} value
 */
export default curry(function set_style(element, key, value) {
  element.style.setProperty(supported(key), value, '');
});