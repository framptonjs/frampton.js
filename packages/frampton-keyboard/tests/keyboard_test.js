import Keyboard from 'frampton-keyboard/keyboard';

QUnit.module('Frampton.Keyboard', {
  beforeEach() {
    this.keyboard = Keyboard();
  },
  afterEach() {
    this.keyboard = null;
  }
});

QUnit.test('Keyboard.arrows should have initial value of [0,0]', function(assert) {
  const actual = this.keyboard.arrows.get();
  const expected = [0, 0];
  assert.deepEqual(actual, expected);
});

QUnit.test('Keyboard.shift should have initial value of false', function(assert) {
  const actual = this.keyboard.shift.get();
  const expected = false;
  assert.equal(actual, expected);
});

QUnit.test('Keyboard.ctrl should have initial value of false', function(assert) {
  const actual = this.keyboard.ctrl.get();
  const expected = false;
  assert.equal(actual, expected);
});

QUnit.test('Keyboard.escape should have initial value of false', function(assert) {
  const actual = this.keyboard.escape.get();
  const expected = false;
  assert.equal(actual, expected);
});

QUnit.test('Keyboard.enter should have initial value of false', function(assert) {
  const actual = this.keyboard.enter.get();
  const expected = false;
  assert.equal(actual, expected);
});

QUnit.test('Keyboard.space should have initial value of false', function(assert) {
  const actual = this.keyboard.space.get();
  const expected = false;
  assert.equal(actual, expected);
});
