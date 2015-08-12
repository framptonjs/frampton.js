import curry from 'frampton-utils/curry';
import contains from 'frampton-list/contains';
import append from 'frampton-list/append';
import remove from 'frampton-list/remove';

import listen from 'frampton-events/listen';
import stepper from 'frampton-signals/stepper';
import KEY_MAP from 'frampton-keyboard/key_map';
import keyCode from 'frampton-keyboard/key_code';

//+ keyUp :: EventStream DomEvent
var keyUp = listen('keyup', document);

//+ keyDown :: EventStream DomEvent
var keyDown = listen('keydown', document);

//+ keyPress :: EventStream DomEvent
var keyPress = listen('keypress', document);

//+ keyUpCodes :: EventStream KeyCode
var keyUpCodes = keyUp.map(keyCode);

//+ keyDownCodes :: EventStream KeyCode
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

//+ direction :: KeyCode -> [KeyCode] -> Boolean
var direction = curry(function(keyCode, arr) {
  return (contains(arr, keyCode)) ? 1 : 0;
});

//+ isUp :: [KeyCode] -> Boolean
var isUp = direction(KEY_MAP.UP);

//+ isDown :: [KeyCode] -> Boolean
var isDown = direction(KEY_MAP.DOWN);

//+ isRight :: [KeyCode] -> Boolean
var isRight = direction(KEY_MAP.RIGHT);

//+ isLeft :: [KeyCode] -> Boolean
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

export default function Keyboard() {
  return defaultKeyboard;
}