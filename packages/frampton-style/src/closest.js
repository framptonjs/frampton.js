import curry from 'frampton-utils/curry';
import matches from 'frampton-style/matches';

/**
 * Searches up the Dom Tree from a given node and returns the first element
 * that matches the selector. If no match is found, null is returned.
 *
 * @name closest
 * @method
 * @memberof Frampton.Style
 * @param {String} selector Selector to search for
 * @param {Object} element  DomNode to start search from
 * @returns {Object} The first DomNode matching the selector or null.
 */
export default curry(function closest(selector, element) {

  while (element) {
    if (matches(selector, element)) {
      break;
    }
    element = element.parentElement;
  }

  return (element || null);
});