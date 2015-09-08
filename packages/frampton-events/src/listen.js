import curry from 'frampton-utils/curry';
import isFunction from 'frampton-utils/is_function';
import contains from 'frampton-events/contains';
import selectorContains from 'frampton-events/selector_contains';
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
var onEvent = curry(function on_selector(eventName, target) {
  if (EVENT_MAP[eventName] && isFunction(target.addEventListener)) {
    return getDocumentStream(eventName).filter(contains(target));
  } else {
    return getEventStream(eventName, target);
  }
});

/**
 * onSelector :: String -> String -> EventStream Event
 *
 * @name listen
 * @memberof Frampton.Events
 * @static
 * @param {String} eventName Name of event to listen for
 * @param {String} selector  Selector to filter events by
 * @returns {Frampton.Signals.EventStream} An EventStream of all occurances of the given event within given selector
 */
var onSelector = curry(function on_selector(eventName, selector) {
  if (EVENT_MAP[eventName]) {
    return getDocumentStream(eventName).filter(selectorContains(selector));
  } else {
    throw new Error('Frampton.Events.onSelector given unrecognized event name: ' + eventName);
  }
});

export {
  onEvent as listen,
  onSelector
};