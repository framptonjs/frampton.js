import curry from 'frampton-utils/curry';
import isFunction from 'frampton-utils/is_function';

/**
 * @name matches
 * @method
 * @memberof Frampton.Style
 * @param {String} selector
 * @param {Object} element
 * @returns {Boolean}
 */
export default curry(function matches(selector, element) {

  if (isFunction(element.matches)) {
    return element.matches(selector);
  } else {
    var elementList = (element.document || element.ownerDocument).querySelectorAll(selector);
    var i = 0;

    while (elementList[i] && elementList[i] !== element) {
      i++;
    }

    return (elementList[i] ? true : false);
  }
});