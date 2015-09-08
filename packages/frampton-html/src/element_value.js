/**
 * elementValue :: Object -> Any
 *
 * @name elementValue
 * @memberof Frampton.Html
 * @static
 * @param {Object} element
 * @returns {*}
 */
export default function element_value(element) {
  return (element.value || null);
}