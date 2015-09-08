import curry from 'frampton-utils/curry';
import supported from 'frampton-style/supported';

/**
 * @name removeStyle
 * @method
 * @memberof Frampton.Style
 * @param {Object} element
 * @param {String} key
 */
export default curry(function remove_style(element, key) {
  element.style.removeProperty(supported(key));
});