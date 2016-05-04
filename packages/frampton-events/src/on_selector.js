import isSomething from 'frampton-utils/is_something';
import isString from 'frampton-utils/is_string';
import isEmpty from 'frampton-utils/is_empty';
import selectorContains from 'frampton-events/selector_contains';
import EVENT_MAP from 'frampton-events/event_map';
import getDocumentStream from 'frampton-events/get_document_stream';
import selectorCache from 'frampton-events/selector_cache';

function validateEventName(name) {
  const parts = name.split(' ').filter((val) => !isEmpty(val));
  const len = parts.length;
  for (let i = 0; i < len; i++) {
    if (!isSomething(EVENT_MAP[parts[i]])) {
      return false;
    }
  }
  return true;
}

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
export default function on_selector(eventName, selector) {
  if (validateEventName(eventName) && isString(selector)) {
    return selectorCache((eventName + selector), () => {
      return getDocumentStream(eventName).filter((evt) => {
        return selectorContains(selector, evt);
      });
    });
  } else {
    throw new Error('Frampton.Events.onSelector given unexpected arguments name: ' + eventName + ', selector: ' + selector);
  }
}