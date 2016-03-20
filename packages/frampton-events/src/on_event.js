import isFunction from 'frampton-utils/is_function';
import isNothing from 'frampton-utils/is_nothing';
import contains from 'frampton-events/contains';
import EVENT_MAP from 'frampton-events/event_map';
import getDocumentStream from 'frampton-events/get_document_stream';
import getEventStream from 'frampton-events/get_event_stream';

/**
 * listen :: String -> Dom -> EventStream Event
 *
 * @name listen
 * @memberof Frampton.Events
 * @static
 * @param {String} eventName Name of event to listen for
 * @param {Object} target    Object on which to listen for event
 * @returns {Frampton.Signals.EventStream} An EventStream of all occurances of the given event on the given object
 */
export default function on_event(eventName, target) {
  if (
    EVENT_MAP[eventName] &&
    (isNothing(target) || isFunction(target.addEventListener))
  ) {
    if (isNothing(target)) {
      return getDocumentStream(eventName);
    } else {
      return getDocumentStream(eventName).filter(contains(target));
    }
  } else {
    return getEventStream(eventName, target);
  }
}