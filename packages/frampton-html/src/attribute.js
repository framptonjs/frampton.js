import curryN from 'frampton-utils/curry_n';

/**
 * attribute :: String -> Element -> String
 *
 * @name attribute
 * @param {String} name
 * @param {Element} element
 * @returns {*}
 */
export default curryN(2, (name, element) => {
  return element.getAttribute(name);
});
