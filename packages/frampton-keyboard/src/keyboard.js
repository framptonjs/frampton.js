import curry from 'frampton-utils/curry';
import contains from 'frampton-list/contains';
import append from 'frampton-list/append';
import remove from 'frampton-list/remove';
import onEvent from 'frampton-events/on_event';
import stepper from 'frampton-signal/stepper';
import KEY_MAP from 'frampton-keyboard/key_map';
import keyCode from 'frampton-keyboard/key_code';

//+ keyUp :: Signal DomEvent
const keyUp = onEvent('keyup');

//+ keyDown :: Signal DomEvent
const keyDown = onEvent('keydown');

//+ keyPress :: Signal DomEvent
const keyPress = onEvent('keypress');

//+ keyUpCodes :: Signal KeyCode
const keyUpCodes = keyUp.map(keyCode);

//+ keyDownCodes :: Signal KeyCode
const keyDownCodes = keyDown.map(keyCode);

const addKey = function(keyCode) {
  return function(arr) {
    if (!contains(arr, keyCode)) {
      return append(arr, keyCode);
    }
    return arr;
  };
};

const removeKey = function(keyCode) {
  return function(arr) {
    return remove(keyCode, arr);
  };
};

const update = function(acc, fn) {
  return fn(acc);
};

//+ rawEvents :: Signal Function
const rawEvents = keyUpCodes.map(removeKey).merge(keyDownCodes.map(addKey));

//+ keysDown :: Signal []
const keysDown = rawEvents.fold(update, []);

//+ keyIsDown :: KeyCode -> Signal Boolean
const keyIsDown = function(keyCode) {
  return keysDown.map(function(arr) {
    return contains(arr, keyCode);
  });
};

//+ direction :: KeyCode -> [KeyCode] -> Boolean
const direction = curry(function(keyCode, arr) {
  return (contains(arr, keyCode)) ? 1 : 0;
});

//+ isUp :: [KeyCode] -> Boolean
const isUp = direction(KEY_MAP.UP);

//+ isDown :: [KeyCode] -> Boolean
const isDown = direction(KEY_MAP.DOWN);

//+ isRight :: [KeyCode] -> Boolean
const isRight = direction(KEY_MAP.RIGHT);

//+ isLeft :: [KeyCode] -> Boolean
const isLeft = direction(KEY_MAP.LEFT);

//+ arrows :: Signal [horizontal, vertical]
const arrows = keysDown.map(function(arr) {
  return [
    (isRight(arr) - isLeft(arr)),
    (isUp(arr) - isDown(arr))
  ];
});

const defaultKeyboard = {
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