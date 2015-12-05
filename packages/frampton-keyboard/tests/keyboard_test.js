import Keyboard from 'frampton-keyboard/keyboard';

QUnit.module('Frampton.Keyboard', {
  beforeEach() {
    this.keyboard = Keyboard();
  },
  afterEach() {
    this.keyboard = null;
  }
});

QUnit.test('should have correct starting value for arrows', function() {
  deepEqual(this.keyboard.arrows.value, [0,0]);
});

QUnit.test('should have correct starting value for shift', function() {
  equal(this.keyboard.shift.value, false);
});