import isFunction from 'frampton-utils/is_function';
import isNothing from 'frampton-utils/is_nothing';
import contains from 'frampton-events/contains';
import EVENT_MAP from 'frampton-events/event_map';
import getDocumentSignal from 'frampton-events/get_document_signal';
import getEventSignal from 'frampton-events/get_event_signal';

/**
 * onEvent :: String -> Dom -> Signal Event
 *
 * @name onEvent
 * @memberof Frampton.Events
 * @static
 * @param {String} eventName Name of event to listen for
 * @param {Object} target    Object on which to listen for event
 * @returns {Frampton.Signal.Signal} A Signal of all occurances of the given event on the given object
 */
export default function on_event(eventName, target) {
  if (
    EVENT_MAP[eventName] &&
    (isNothing(target) || isFunction(target.addEventListener))
  ) {
    if (isNothing(target)) {
      return getDocumentSignal(eventName);
    } else {
      return getDocumentSignal(eventName).filter(contains(target));
    }
  } else {
    return getEventSignal(eventName, target);
  }
}