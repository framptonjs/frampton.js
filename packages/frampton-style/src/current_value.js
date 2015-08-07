import curry from 'frampton-utils/curry';

var style = window.getComputedStyle;

// current :: DomNode -> String -> String
export default curry(function current(element, prop) {
  return style(element).getPropertyValue(prop);
});