import Keyboard from 'frampton-keyboard/keyboard';

QUnit.module('Frampton.Keyboard', {
  beforeEach() {
    this.keyboard = Keyboard();
  },
  afterEach() {
    this.keyboard = null;
  }
});

QUnit.test('Keyboard.arrows should have initial value of [0,0]', function() {
  deepEqual(this.keyboard.arrows(), [0,0]);
});

QUnit.test('Keyboard.shift should have initial value of false', function() {
  equal(this.keyboard.shift(), false);
});

QUnit.test('Keyboard.ctrl should have initial value of false', function() {
  equal(this.keyboard.ctrl(), false);
});

QUnit.test('Keyboard.escape should have initial value of false', function() {
  equal(this.keyboard.escape(), false);
});

QUnit.test('Keyboard.enter should have initial value of false', function() {
  equal(this.keyboard.enter(), false);
});

QUnit.test('Keyboard.space should have initial value of false', function() {
  equal(this.keyboard.space(), false);
});