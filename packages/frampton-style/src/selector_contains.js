import curry from 'frampton-utils/curry';
import contains from 'frampton-html/contains';

/**
 * Searches inside all elements with the given selector and returns if one of them
 * contains the given element.
 *
 * @name selectorContains
 * @method
 * @memberof Frampton.Style
 * @param {String} selector Selector to search inside of
 * @param {Object} element  DomNode to search for
 * @returns {Boolean} Is there a match for the element?
 */
export default curry(function selector_contains(selector, element) {

  var elementList = (element.document || element.ownerDocument).querySelectorAll(selector);
  var i = 0;

  while (elementList[i] && !contains(elementList[i], element)) {
    i++;
  }

  return (elementList[i] ? true : false);
});