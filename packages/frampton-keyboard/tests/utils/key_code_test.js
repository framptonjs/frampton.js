import keyCode from 'frampton-keyboard/utils/key_code';

QUnit.module('Frampton.Keyboard.Utils.keyCode');

const mockEvent = {
  keyCode : 84
};

QUnit.test('Should correctly get keyCode form event object', function(assert) {
  const actual = keyCode(mockEvent);
  const expected = 84;
  assert.equal(actual, expected);
});
