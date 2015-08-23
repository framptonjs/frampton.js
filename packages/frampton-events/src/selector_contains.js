import curry from 'frampton-utils/curry';
import isSomething from 'frampton-utils/is_something';
import closestToEvent from 'frampton-events/closest_to_event';

/**
 * selectorContains :: String -> DomEvent -> Boolean
 *
 * Tests if the target of a given event is contained in a node that matches
 * the given selector.
 *
 * @name selectorContains
 * @memberOf Frampton.Events
 * @static
 * @param {String} selector
 * @param {Object} evt
 * @returns {Boolean} Is the event contained in a node that matches the given selector
 */
export default curry(function selector_contains(selector, evt) {
  return isSomething(closestToEvent(selector, evt));
});