import stepper from 'frampton-signal/stepper';
import onEvent from 'frampton-events/on_event';
import get from 'frampton-utils/get';
import isSomething from 'frampton-utils/is_something';

const element = null;
const resize = onEvent('resize', window);
const dimensions = stepper([getWidth(), getHeight()], resize.map(update));
const width = stepper(getWidth(), dimensions.map(get(0)));
const height = stepper(getHeight(), dimensions.map(get(1)));

function getWidth() {
  return (isSomething(element)) ? element.clientWidth : window.innerWidth;
}

function getHeight() {
  return (isSomething(element)) ? element.clientHeight : window.innerHeight;
}

function update() {
  const w = getWidth();
  const h = getHeight();
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
 * @namespace
 * @memberof Frampton
 * @param {Object} [element] - DomNode to act as applicaton window
 * @returns {Window}
 */
export default function Window(element) {
  element = element;
  return {
    dimensions : dimensions,
    width : width,
    height : height,
    resize : resize
  };
}
