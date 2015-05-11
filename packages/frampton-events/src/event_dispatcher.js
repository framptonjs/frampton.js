import {
  assert,
  isFunction,
  lazy
} from 'frampton-utils';

/**
 *
 */
var EVENT_MAPPING = {
  focus : 'focusin',
  blur  : 'focusout'
};

var EVENT_CACHE = {};

var listeners = {};

var listener = {
  target : null,
  callback : null
};

function eventFor(eventName, target) {

}

function addCustomEvent(eventName, callback, target) {

}

function addListener(eventName, callback, target) {

  var listen = isFunction(target.addEventListener) ? target.addEventListener :
               isFunction(target.on) ? target.on : null;

  assert('addListener received an unknown type as target', isFunction(listen));

  listen.call(target, eventName, callback);

  return lazy(removeListener, eventName, callback, target);
}

function removeListener(eventName, callback, target) {

  var remove = isFunction(target.removeEventListener) ? target.removeEventListener :
               isFunction(target.off) ? target.off : null;

  assert('removeListener received an unknown type as target', isFunction(remove));

  remove.call(target, eventName, callback);
}

export {
  addListener,
  removeListener
};