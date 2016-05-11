import curry from 'frampton-utils/curry';
import isSomething from 'frampton-utils/is_something';
import removeStyle from 'frampton-style/remove_style';
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
    const value = props[key];
    if (isSomething(value)) {
      setStyle(element, key, value);
    } else {
      removeStyle(element, key, value);
    }
  }
});