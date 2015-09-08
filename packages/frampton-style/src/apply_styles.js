import curry from 'frampton-utils/curry';
import setStyle from 'frampton-style/set_style';

/**
 * @name applyStyles
 * @method
 * @memberof Frampton.Style
 * @param {Object} element DomNode to add styles to
 * @param {Object} props   Has of props to add
 */
export default curry(function apply_styles(element, props) {
  for (let key in props) {
    setStyle(element, key, props[key]);
  }
});