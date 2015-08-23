/**
 * elementValue :: Object -> Any
 *
 * @name elementValue
 * @memberOf Frampton.Html
 * @static
 * @param {Object} element
 * @returns {Any}
 */
export default function element_value(element) {
  return (element.value || null);
}