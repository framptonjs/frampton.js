import {
  empty,
  listen,
  stepper,
  nextEvent
} from 'frampton-signals';

import isSomething from 'frampton-utils/is_something';

var element = null;
var resize = listen('resize', window);
var dimensionsStream = empty();
var dimensions = stepper([getWidth(), getHeight()], dimensionsStream);

function getWidth() {
  return (isSomething(element)) ? element.clientWidth : window.innerWidth;
}

function getHeight() {
  return (isSomething(element)) ? element.clientHeight : window.innerHeight;
}

function updateIfNeeded() {
  var w = getWidth();
  var h = getHeight();
  if (w !== dimensions[0] || h !== dimensions[1]) {
    dimensionsStream.push(nextEvent([w, h]));
  }
}

function update() {
  updateIfNeeded();
  setTimeout(updateIfNeeded, 0);
}

resize.next(update);

export default function Window(element) {
  element = element;
  return {
    dimensions : dimensions
  };
}