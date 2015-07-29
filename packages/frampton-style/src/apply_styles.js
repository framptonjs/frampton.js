import curry from 'frampton-utils/curry';
import setStyle from 'frampton-style/set_style';

export default curry(function apply_styles(element, props) {
  for (let key in props) {
    setStyle(element, key, props[key]);
  }
});