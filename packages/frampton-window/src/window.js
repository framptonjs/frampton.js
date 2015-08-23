import empty from 'frampton-signals/empty';
import stepper from 'frampton-signals/stepper';
import listen from 'frampton-events/listen';
import get from 'frampton-utils/get';
import isSomething from 'frampton-utils/is_something';

var element = null;
var resize = listen('resize', window);
var dimensionsStream = empty();
var dimensions = stepper([getWidth(), getHeight()], dimensionsStream);
var width = stepper(getWidth(), dimensionsStream.map(get(0)));
var height = stepper(getHeight(), dimensionsStream.map(get(1)));

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
    dimensionsStream.pushNext([w, h]);
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
    dimensions : dimensions,
    width      : width,
    height     : height,
    resize     : resize
  };
}