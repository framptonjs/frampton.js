import curry from 'frampton-utils/curry';
import compose from 'frampton-utils/compose';
import contains from 'frampton-style/contains';
import eventTarget from 'frampton-events/event_target';

/**
 * containsSelector :: String -> DomEvent -> Boolean
 *
 * Does the target of the given event object contain an object with the
 * given selector?
 *
 * @name containsSelector
 * @static
 * @memberof Frampton.Events
 * @param {String} selector - A selector to test
 * @param {Object} evt - An event object whose target will be tested against
 * @returns {Boolean} Does the event target, or one of its children, have the given selector
 */
export default curry(function contains_selector(selector, evt) {
  return compose(contains(selector), eventTarget)(evt);
});
