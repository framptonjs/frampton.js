import { Behavior } from 'frampton-signals';

QUnit.module('Frampton.Signals.Behavior');

QUnit.test('of method should return Behavior with initial value', function() {
  var behavior = Behavior.of(5);
  equal(behavior.value, 5, 'has initial value');
  behavior.changes((val) => {
    equal(val, 5, 'persists initial value');
  });
});

QUnit.test('update method should notify listeners', function() {
  var behavior = Behavior.of(5);
  var count = 0;
  behavior.changes((val) => {
    console.log('change: ' + val);
    if (count === 0) {
      equal(val, 5, 'notifies listener of initial value');
    } else {
      equal(val, 6, 'notifies listener of updated value');
    }
    count++;
  });
  behavior.update(6);
});

QUnit.test('destroy method should call cleanup', function(assert) {
  var done = assert.async();
  var behavior = new Behavior(0, function seed(sink) {

    var timerId = null;
    var frame = 0;
    var isStopped = false;

    timerId = setTimeout(function step() {
      sink(frame++);
      if (!isStopped) timerId = setTimeout(step);
    }, 100);

    ok(true, 'seed function called');

    return function() {
      clearTimeout(timerId);
      isStopped = true;
      ok(true, 'cleanup called');
      done();
    };
  });
  behavior.changes((val) => {
    equal(val, 0, 'initial value is correct');
    behavior.destroy();
  });
});