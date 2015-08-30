import empty from 'frampton-signals/empty';
import toggle from 'frampton-signals/toggle';

QUnit.module('Frampton.Signals.toggle');

QUnit.test('creates a Behavior with initial Boolean value', function() {
  var stream = empty();
  var behavior = toggle(true, stream);
  equal(behavior.value, true, 'has correct initial value');
});

QUnit.test("creates a Behavior that correctly toggles it's value", function(assert) {
  var done = assert.async();
  var count = 0;
  var stream = empty();
  var behavior = toggle(true, stream);
  behavior.changes(function() {
    if (count === 0) {
      equal(behavior.value, true, 'has correct initial value');
    } else if (count === 1) {
      equal(behavior.value, false, 'has correct 2nd value');
    } else if (count === 2) {
      equal(behavior.value, true, 'has correct 3rd value');
      done();
    }

    count++;
  });
  stream.pushNext('test');
  stream.pushNext('test');
  stream.pushNext('test');
});