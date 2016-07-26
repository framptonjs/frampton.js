import curry from 'frampton-utils/curry';
import attribute from 'frampton-html/attribute';

/**
 * data :: String -> Element -> String
 *
 * @name attribute
 * @param {String} name
 * @param {Element} element
 * @returns {*}
 */
export default curry((name, element) => {
  return attribute(('data-' + name), element);
});
