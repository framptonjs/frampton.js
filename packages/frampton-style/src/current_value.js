import curry from 'frampton-utils/curry';
import supported from 'frampton-style/supported';

var style = window.getComputedStyle;

/**
 * current :: DomNode -> String -> String
 *
 * @name currentValue
 * @method
 * @memberof Frampton.Style
 * @param {Object} element DomNode whose property to check
 * @param {String} prop    Name of property to check
 * @returns {String} String representation of current property value
 */
export default curry(function current(element, prop) {
  return style(element).getPropertyValue(supported(prop));
});