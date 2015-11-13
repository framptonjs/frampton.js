/**
 * elementValue :: Object -> Any
 *
 * @name elementValue
 * @method
 * @memberof Frampton.Html
 * @param {Object} element
 * @returns {*}
 */
export default function element_value(element) {
  return (element.value || null);
}