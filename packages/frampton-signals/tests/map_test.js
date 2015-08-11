import map from 'frampton-signals/map';
import Behavior from 'frampton-signals/behavior';

QUnit.module('Frampton.Signals.map');

QUnit.test('should map a Behavior to a new Behavior with given function', function() {
  var b1 = new Behavior(0);
  var b2 = map((num) => num + 1, b1);
  var count = 0;
  b2.changes((val) => {
    if (count === 0) {
      equal(val, 1);
    } else if (count === 1) {
      equal(val, 2);
    }
    count += 1;
  });
  b1.update(1);
});