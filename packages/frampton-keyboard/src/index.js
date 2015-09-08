import Frampton from 'frampton/namespace';
import Keyboard from 'frampton-keyboard/keyboard';
import keyCode from 'frampton-keyboard/key_code';
import isKey from 'frampton-keyboard/is_key';
import isEnter from 'frampton-keyboard/is_enter';
import isEsc from 'frampton-keyboard/is_esc';
import isUp from 'frampton-keyboard/is_up';
import isDown from 'frampton-keyboard/is_down';
import isLeft from 'frampton-keyboard/is_left';
import isRight from 'frampton-keyboard/is_right';
import isSpace from 'frampton-keyboard/is_space';
import isCtrl from 'frampton-keyboard/is_ctrl';
import isShift from 'frampton-keyboard/is_shift';

/**
 * @name Keyboard
 * @namespace
 * @memberof Frampton
 */
Frampton.Keyboard = Keyboard;
Frampton.Keyboard.keyCode = keyCode;
Frampton.Keyboard.isKey   = isKey;
Frampton.Keyboard.isEnter = isEnter;
Frampton.Keyboard.isEsc   = isEsc;
Frampton.Keyboard.isUp    = isUp;
Frampton.Keyboard.isDown  = isDown;
Frampton.Keyboard.isLeft  = isLeft;
Frampton.Keyboard.isRight = isRight;
Frampton.Keyboard.isShift = isShift;
Frampton.Keyboard.isSpace = isSpace;
Frampton.Keyboard.isCtrl  = isCtrl;