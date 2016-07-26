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
  assert.deepEqual(this.keyboard.arrows.get(), [0,0]);
});

QUnit.test('Keyboard.shift should have initial value of false', function(assert) {
  assert.equal(this.keyboard.shift.get(), false);
});

QUnit.test('Keyboard.ctrl should have initial value of false', function(assert) {
  assert.equal(this.keyboard.ctrl.get(), false);
});

QUnit.test('Keyboard.escape should have initial value of false', function(assert) {
  assert.equal(this.keyboard.escape.get(), false);
});

QUnit.test('Keyboard.enter should have initial value of false', function(assert) {
  assert.equal(this.keyboard.enter.get(), false);
});

QUnit.test('Keyboard.space should have initial value of false', function(assert) {
  assert.equal(this.keyboard.space.get(), false);
});
