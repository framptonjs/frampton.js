import curry from 'frampton-utils/curry';

/**
 * removeStyles :: DomNode -> Object -> ()
 *
 * @name removeStyles
 * @method
 * @memberof Frampton.Style
 * @param {Object} element A dom node to remove styles from
 * @param {Object} props   A hash of properties to remove
 */
export default curry(function remove_styles(element, props) {
  for (let key in props) {
    element.style.removeProperty(key);
  }
});