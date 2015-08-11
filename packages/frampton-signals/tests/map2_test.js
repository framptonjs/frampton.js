import map2 from 'frampton-signals/map2';
import Behavior from 'frampton-signals/behavior';

QUnit.module('Frampton.Signals.map2');

QUnit.test('should map a Behavior to a new Behavior with given function', function() {
  var b1 = new Behavior(0);
  var b2 = new Behavior(1);
  var b3 = map2((num1, num2) => num1 + num2, b1, b2);
  var count = 0;
  b3.changes((val) => {
    if (count === 0) {
      equal(val, 1);
    } else if (count === 1) {
      equal(val, 3);
    } else if (count === 2) {
      equal(val, 5);
    }
    count += 1;
  });
  b2.update(3);
  b1.update(2);
});