import assert from 'frampton-utils/assert';
import isFunction from 'frampton-utils/is_function';
import isDefined from 'frampton-utils/is_defined';
import lazy from 'frampton-utils/lazy';
import EVENT_MAP from 'frampton-events/event_map';

// get dom event -> filter -> return stream
function addDomEvent(name, node, callback) {
  node.addEventListener(name, callback, !EVENT_MAP[name].bubbles);
}

function addCustomEvent(name, target, callback) {
  const listen = isFunction(target.addEventListener) ? target.addEventListener :
               isFunction(target.on) ? target.on : null;

  assert('addListener received an unknown type as target', isFunction(listen));

  listen.call(target, name, callback);
}

function removeDomEvent(name, node, callback) {
  node.removeEventListener(name, callback, !EVENT_MAP[name].bubbles);
}

function removeCustomEvent(name, target, callback) {
  const remove = isFunction(target.removeEventListener) ? target.removeEventListener :
               isFunction(target.off) ? target.off : null;

  assert('removeListener received an unknown type as target', isFunction(remove));

  remove.call(target, name, callback);
}

function addListener(eventName, target, callback) {

  if (isDefined(EVENT_MAP[eventName]) && isFunction(target.addEventListener)) {
    addDomEvent(eventName, target, callback);
  } else {
    addCustomEvent(eventName, target, callback);
  }

  return lazy(removeListener, [eventName, target, callback]);
}

function removeListener(eventName, target, callback) {
  if (isDefined(EVENT_MAP[eventName]) && isFunction(target.removeEventListener)) {
    removeDomEvent(eventName, target, callback);
  } else {
    removeCustomEvent(eventName, target, callback);
  }
}

export {
  addListener,
  removeListener
};