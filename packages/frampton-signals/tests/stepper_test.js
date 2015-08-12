import { nextEvent } from 'frampton-signals/event';
import empty from 'frampton-signals/empty';
import stepper from 'frampton-signals/stepper';

QUnit.module('Frampton.Signals.stepper');

QUnit.test('creates a Behavior with initial value', function() {
  var stream = empty();
  var behavior = stepper(5, stream);
  equal(behavior.value, 5, 'has correct initial value');
});

QUnit.test('creates a Behavior that updates with EventStream', function() {
  var stream = empty();
  var behavior = stepper(5, stream);
  var count = 0;
  behavior.changes((val) => {
    if (count === 0) {
      equal(val, 5, 'has correct initial value');
    } else {
      equal(val, 6, 'correctly updates with EventStream');
    }
    count++;
  });
  stream.push(nextEvent(6));
});