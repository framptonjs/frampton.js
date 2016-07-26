import curry from 'frampton-utils/curry';
import supported from 'frampton-style/supported';

/**
 * @name setStyle
 * @method
 * @memberof Frampton.Style
 * @param {Object} element - Element to apply style to
 * @param {String} key - Style to update
 * @param {String} value - Value of style
 */
export default curry(function set_style(element, key, value) {
  element.style.setProperty(supported(key), value, '');
});
