import Behavior from 'frampton-signals/behavior';

QUnit.module('Frampton.Signals.Behavior');

QUnit.test('of method should return Behavior with initial value', function() {
  var behavior = Behavior.of(5);
  equal(behavior.value, 5, 'has initial value');
  behavior.changes((val) => {
    equal(val, 5, 'persists initial value');
  });
});

QUnit.test('join method should flatten nested Behaviors', function() {
  var behavior = Behavior.of(Behavior.of(5)).join();
  equal(behavior.value, 5, 'has initial value');
  behavior.changes((val) => {
    equal(val, 5, 'persists initial value');
  });
});

QUnit.test('map method should update value correclty', function() {
  var behavior = Behavior.of(5).map((val) => val + 1);
  equal(behavior.value, 6, 'has initial value');
  behavior.changes((val) => {
    equal(val, 6, 'persists initial value');
  });
});

QUnit.test('fold method should update value correclty', function(assert) {
  var done = assert.async();
  var count = 0;
  var seed = Behavior.of(5);
  var behavior = seed.fold((acc, next) => {
    return acc + next;
  }, 0);
  equal(behavior.value, 5, 'has initial value');
  behavior.changes((val) => {
    if (count === 0) {
      equal(val, 5, 'value persists');
    } else if (count === 1) {
      equal(val, 11, 'correct 2nd value');
    } else if (count === 2) {
      equal(val, 19, 'correct 3rd value');
      done();
    }
  });
  count++;
  seed.update(6);
  count++;
  seed.update(8);
});

QUnit.test('chain method should produce a new Behavior from mapping', function() {
  var behavior = Behavior.of(5).chain((val) => {
    return Behavior.of(val + 1);
  });
  equal(behavior.value, 6, 'has initial value');
  behavior.changes((val) => {
    equal(val, 6, 'persists initial value');
  });
});

QUnit.test('update method should notify listeners', () => {
  var behavior = Behavior.of(5);
  var count = 0;
  behavior.changes((val) => {
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
      ok(true);
      done();
    };
  });
  behavior.changes((val) => {
    equal(val, 0, 'initial value is correct');
    behavior.destroy();
  });
});