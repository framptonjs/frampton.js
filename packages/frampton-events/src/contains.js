import curry from 'frampton-utils/curry';
import compose from 'frampton-utils/compose';
import contains from 'frampton-html/contains';
import eventTarget from 'frampton-events/event_target';

/**
 * contains :: DomNode -> DomEvent -> Boolean
 *
 * @name contains
 * @memberof Frampton.Events
 * @static
 * @param {Object} element
 * @param {Object} evt
 * @returns {Boolean}
 */
export default curry(function curried_contains(element, evt) {
  return compose(contains(element), eventTarget)(evt);
});