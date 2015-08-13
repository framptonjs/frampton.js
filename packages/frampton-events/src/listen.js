import curry from 'frampton-utils/curry';
import isFunction from 'frampton-utils/is_function';
import EventStream from 'frampton-signals/event_stream';
import { nextEvent } from 'frampton-signals/event';
import contains from 'frampton-events/contains';
import EVENT_MAP from 'frampton-events/event_map';
import { addListener } from 'frampton-events/event_dispatcher';
import documentCache from 'frampton-events/document_cache';

function getEventStream(name, target) {
  return new EventStream((sink) => {
    return addListener(
      name,
      evt => sink(nextEvent(evt)),
      target
    );
  });
}

function getDocumentStream(name) {
  return documentCache.get(name, function() {
    return getEventStream(name, document);
  });
}

/**
 * listen :: String -> Dom -> EventStream Event
 *
 * @name listen
 * @memberOf Frampton.Events
 * @static
 * @param {String} eventName Name of event to listen for
 * @param {Object} target    Object on which to listen for event
 * @returns {EventStream} An EventStream of all occurances of the given event on the given object
 */
export default curry(function listen(eventName, target) {
  if (EVENT_MAP[eventName] && isFunction(target.addEventListener)) {
    return getDocumentStream(eventName).filter(contains(target));
  } else {
    return getEventStream(eventName, target);
  }
});