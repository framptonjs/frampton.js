import curry from 'frampton-utils/curry';
import isSomething from 'frampton-utils/is_something';
import capitalize from 'frampton-string/capitalize';
import dashToCamel from 'frampton-string/dash_to_camel';

var vendors = {
  'webkit' : 'webkit',
  'Webkit' : 'webkit',
  'Moz'    : 'moz',
  'ms'     : 'ms',
  'Ms'     : 'ms'
};

/**
 * @name supportedByElement
 * @method
 * @memberof Frampton.Style
 * @param {Object} element
 * @param {String} prop
 * @returns {String}
 */
export default curry(function supported_by_element(element, prop) {

  var camelProp = dashToCamel(prop);

  if (isSomething(element.style[camelProp])) {
    return prop;
  }

  for (let key in vendors) {
    let propToCheck = key + capitalize(camelProp);
    if (isSomething(element.style[propToCheck])) {
      return ('-' + vendors[key] + '-' + prop).toLowerCase();
    }
  }

  return null;
});