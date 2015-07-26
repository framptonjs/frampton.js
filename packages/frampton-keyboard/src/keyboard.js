import { curry } from 'frampton-utils';

import {
  contains,
  append,
  remove
} from 'frampton-list';

import {
  listen,
  stepper
} from 'frampton-signals';

import KEY_MAP from 'frampton-keyboard/key_map';
import keyCode from 'frampton-keyboard/key_code';

var keyUp = listen('keyup', document);
var keyDown = listen('keydown', document);
var keyPress = listen('keypress', document);
var keyUpCodes = keyUp.map(keyCode);
var keyDownCodes = keyDown.map(keyCode);

var addKey = function(keyCode) {
  return function(arr) {
    if (!contains(arr, keyCode)) {
      return append(arr, keyCode);
    }
    return arr;
  };
};

var removeKey = function(keyCode) {
  return function(arr) {
    return remove(arr, keyCode);
  };
};

var update = function(acc, fn) {
  return fn(acc);
};

//+ rawEvents :: EventStream Function
var rawEvents = keyUpCodes.map(removeKey).merge(keyDownCodes.map(addKey));

//+ keysDown :: EventStream []
var keysDown = rawEvents.fold(update, []);

//+ keyIsDown :: KeyCode -> EventStream Boolean
var keyIsDown = function(keyCode) {
  return keysDown.map(function(arr) {
    return contains(arr, keyCode);
  });
};

var direction = curry(function(keyCode, arr) {
  return (contains(arr, keyCode)) ? 1 : 0;
});

var isUp = direction(KEY_MAP.UP);

var isDown = direction(KEY_MAP.DOWN);

var isRight = direction(KEY_MAP.RIGHT);

var isLeft = direction(KEY_MAP.LEFT);

//+ arrows :: EventStream [horizontal, vertical]
var arrows = keysDown.map(function(arr) {
  return [
    (isRight(arr) - isLeft(arr)),
    (isUp(arr) - isDown(arr))
  ];
});

var defaultKeyboard = {
  downs   : keyDown,
  ups     : keyUp,
  presses : keyPress,
  codes   : keyUpCodes,
  arrows  : stepper([0,0], arrows),
  shift   : stepper(false, keyIsDown(KEY_MAP.SHIFT)),
  ctrl    : stepper(false, keyIsDown(KEY_MAP.CTRL)),
  escape  : stepper(false, keyIsDown(KEY_MAP.ESC)),
  enter   : stepper(false, keyIsDown(KEY_MAP.ENTER)),
  space   : stepper(false, keyIsDown(KEY_MAP.SPACE))
};

export default function Keyboard(element) {
  return defaultKeyboard;
}