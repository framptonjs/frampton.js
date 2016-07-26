import curry from 'frampton-utils/curry';

/**
 * attribute :: String -> Element -> String
 *
 * @name attribute
 * @param {String} name
 * @param {Element} element
 * @returns {*}
 */
export default curry((name, element) => {
  return element.getAttribute(name);
});
