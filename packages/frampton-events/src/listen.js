import curry from 'frampton-utils/curry';
import EventStream from 'frampton-signals/event_stream';
import { nextEvent } from 'frampton-signals/event';
import contains from 'frampton-events/contains';
import EVENT_MAP from 'frampton-events/event_map';
import { addListener } from 'frampton-events/event_dispatcher';

var DOCUMENT_CACHE = {};

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
  if (!DOCUMENT_CACHE[name]) {
    DOCUMENT_CACHE[name] = getEventStream(name, document);
  }
  return DOCUMENT_CACHE[name];
}

// listen :: String -> Dom -> EventStream Event
export default curry(function listen(eventName, target) {
  if (EVENT_MAP[eventName]) {
    return getDocumentStream(eventName).filter(contains(target));
  } else {
    return getEventStream(eventName, target);
  }
});