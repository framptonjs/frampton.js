import stepper from 'frampton-signals/stepper';
import listen from 'frampton-events/listen';
import contains from 'frampton-events/contains';
import getPosition from 'frampton-events/get_position';
import getPositionRelative from 'frampton-events/get_position_relative';

var clickStream = listen('click', document);
var downStream = listen('mousedown', document);
var upStream = listen('mouseup', document);
var moveStream = listen('mousemove', document);
var isDown = stepper(false, downStream.map(true).merge(upStream.map(false)));

var defaultMouse = {
  clicks   : clickStream,
  downs    : downStream,
  ups      : upStream,
  position : stepper([0,0], moveStream.map(getPosition)),
  isDown   : isDown
};

export default function Mouse(element) {
  if (!element) {
    return defaultMouse;
  } else {
    return {
      clicks   : clickStream.filter(contains(element)),
      downs    : downStream.filter(contains(element)),
      ups      : upStream.filter(contains(element)),
      position : stepper([0,0], moveStream.filter(contains(element)).map(getPositionRelative(element))),
      isDown   : isDown
    };
  }
}