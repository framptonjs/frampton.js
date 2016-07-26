import Frampton from 'frampton/namespace';
import Keyboard from 'frampton-keyboard/keyboard';
import keyCode from 'frampton-keyboard/utils/key_code';
import isKey from 'frampton-keyboard/utils/is_key';
import isEnter from 'frampton-keyboard/utils/is_enter';
import isEsc from 'frampton-keyboard/utils/is_esc';
import isUp from 'frampton-keyboard/utils/is_up';
import isDown from 'frampton-keyboard/utils/is_down';
import isLeft from 'frampton-keyboard/utils/is_left';
import isRight from 'frampton-keyboard/utils/is_right';
import isSpace from 'frampton-keyboard/utils/is_space';
import isCtrl from 'frampton-keyboard/utils/is_ctrl';
import isShift from 'frampton-keyboard/utils/is_shift';

/**
 * @name Keyboard
 * @namespace
 * @memberof Frampton
 */
Frampton.Keyboard = Keyboard;

Frampton.Keyboard.Utils = {};
Frampton.Keyboard.Utils.keyCode = keyCode;
Frampton.Keyboard.Utils.isKey   = isKey;
Frampton.Keyboard.Utils.isEnter = isEnter;
Frampton.Keyboard.Utils.isEsc   = isEsc;
Frampton.Keyboard.Utils.isUp    = isUp;
Frampton.Keyboard.Utils.isDown  = isDown;
Frampton.Keyboard.Utils.isLeft  = isLeft;
Frampton.Keyboard.Utils.isRight = isRight;
Frampton.Keyboard.Utils.isShift = isShift;
Frampton.Keyboard.Utils.isSpace = isSpace;
Frampton.Keyboard.Utils.isCtrl  = isCtrl;
