import curry from 'frampton-utils/curry';
import matches from 'frampton-style/matches';

/**
 * Searches inside the given element and returns true if the given element, or
 * one of its children matches the given selector, false otherwise.
 *
 * @name contains
 * @method
 * @memberof Frampton.Style
 * @param {String} selector Selector to search for
 * @param {Object} element  DomNode to search inside of
 * @returns {Boolean} Is there a match for the selector?
 */
export default curry(function contains(selector, element) {
  return (matches(selector, element) || element.querySelectorAll(selector).length > 0);
});