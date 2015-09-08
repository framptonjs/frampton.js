import memoize from 'frampton-utils/memoize';
import supportedByElement from 'frampton-style/supported_by_element';

/**
 * supported :: String -> String
 *
 * @name supported
 * @method
 * @memberof Frampton.Style
 * @param {String} prop A standard CSS property name
 * @returns {String} The property name with any vendor prefixes required by the browser, or null if the property is not supported
 */
export default memoize(supportedByElement(document.createElement('div')));