import isSomething from 'frampton-utils/is_something';
import isString from 'frampton-utils/is_string';
import isEmpty from 'frampton-utils/is_empty';
import closestToEvent from 'frampton-events/closest_to_event';
import selectorContains from 'frampton-events/selector_contains';
import EVENT_MAP from 'frampton-events/event_map';
import getDocumentSignal from 'frampton-events/get_document_signal';
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

function mouseEnterSelector(selector) {
  var previousElement = null;
  return getDocumentSignal('mouseover').filter((evt) => {
    const current = closestToEvent(selector, evt);
    if (isSomething(current) && current !== previousElement) {
      previousElement = current;
      return true;
    } else {
      return false;
    }
  });
}

function mouseLeaveSelector(selector) {
  var previousElement = null;
  return getDocumentSignal('mouseleave').filter((evt) => {
    const current = closestToEvent(selector, evt);
    if (isSomething(current) && current !== previousElement) {
      previousElement = current;
      return true;
    } else if (isSomething(current)) {
      previousElement = current;
      return false;
    } else {
      return false;
    }
  });
}

/**
 * onSelector :: String -> String -> Signal Event
 *
 * @name onSelector
 * @memberof Frampton.Events
 * @static
 * @param {String} eventName Name of event to listen for
 * @param {String} selector  Selector to filter events by
 * @returns {Frampton.Signal.Signal} A Signal of all occurances of the given event within given selector
 */
function onSelector(eventName, selector) {
  if (validateEventName(eventName) && isString(selector)) {
    return selectorCache((eventName + ' | ' + selector), () => {
      if (eventName === 'mouseenter') {
        return mouseEnterSelector(selector);
      } else if (eventName === 'mouseleave') {
        return mouseLeaveSelector(selector);
      } else {
        return getDocumentSignal(eventName).filter((evt) => {
          return selectorContains(selector, evt);
        });
      }
    });
  } else {
    throw new Error('Frampton.Events.onSelector given unexpected arguments name: ' + eventName + ', selector: ' + selector);
  }
}

export default onSelector;