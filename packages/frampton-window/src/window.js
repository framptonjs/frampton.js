import stepper from 'frampton-signal/stepper';
import onEvent from 'frampton-events/on_event';
import get from 'frampton-utils/get';
import isSomething from 'frampton-utils/is_something';

var element = null;
var resize = onEvent('resize', window);
var dimensions = stepper([getWidth(), getHeight()], resize.map(update));
var width = stepper(getWidth(), dimensions.map(get(0)));
var height = stepper(getHeight(), dimensions.map(get(1)));

function getWidth() {
  return (isSomething(element)) ? element.clientWidth : window.innerWidth;
}

function getHeight() {
  return (isSomething(element)) ? element.clientHeight : window.innerHeight;
}

function update() {
  var w = getWidth();
  var h = getHeight();
  return [w, h];
}

/**
 * @typedef Window
 * @type Object
 * @property {Frampton.Signal} dimensions - A Signal of the window dimensions
 * @property {Frampton.Signal} width      - A Signal of with window width
 * @property {Frampton.Signal} height     - A Signal of the window height
 * @property {Frampton.Signal} resize     - A Signal of window resize events
 */

/**
 * @name Window
 * @method
 * @memberof Frampton
 * @param {Object} [element] - DomNode to act as applicaton window
 * @returns {Window}
 */
export default function Window(element) {
  element = element;
  return {
    dimensions : dimensions,
    width      : width,
    height     : height,
    resize     : resize
  };
}
