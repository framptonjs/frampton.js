import curry from 'frampton-utils/curry';
import compose from 'frampton-utils/compose';
import closest from 'frampton-style/closest';
import eventTarget from 'frampton-events/event_target';

/**
 * closestToEvent :: String -> DomEvent -> DomNode
 *
 * Gets the closest parent to the event target matching the given selector
 *
 * @name closestToEvent
 * @memberof Frampton.Events
 * @static
 * @param {String} selector
 * @param {Object} evt
 * @returns {Object} A DomNode matching the given selector
 */
export default curry(function closest_to_event(selector, evt) {
  return compose(closest(selector), eventTarget)(evt);
});
