import stepper from 'frampton-signal/stepper';
import onEvent from 'frampton-events/on_event';
import contains from 'frampton-events/contains';
import getPosition from 'frampton-events/get_position';
import getPositionRelative from 'frampton-events/get_position_relative';

const clicks = onEvent('click');
const downs = onEvent('mousedown');
const ups = onEvent('mouseup');
const moves = onEvent('mousemove');
const isDown = stepper(false, downs.map(true).merge(ups.map(false)));

const defaultMouse = {
  clicks   : clicks,
  downs    : downs,
  ups      : ups,
  position : stepper([0,0], moves.map(getPosition)),
  isDown   : isDown
};

/**
 * @name Mouse
 * @memberof Frampton
 * @class
 */
export default function Mouse(element) {
  if (!element) {
    return defaultMouse;
  } else {
    return {
      clicks   : clicks.filter(contains(element)),
      downs    : downs.filter(contains(element)),
      ups      : ups.filter(contains(element)),
      position : stepper([0,0], moves.filter(contains(element)).map(getPositionRelative(element))),
      isDown   : isDown
    };
  }
}