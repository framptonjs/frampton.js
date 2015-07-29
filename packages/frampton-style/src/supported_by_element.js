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

export default curry(function supported_by_element(el, prop) {

  var camelProp = dashToCamel(prop);

  if (isSomething(el.style[camelProp])) {
    return prop;
  }

  for (let key in vendors) {
    let propToCheck = key + capitalize(camelProp);
    if (isSomething(el.style[propToCheck])) {
      return ('-' + vendors[key] + '-' + prop).toLowerCase();
    }
  }

  return null;
});