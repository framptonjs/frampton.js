import count from 'frampton-signals/count';
import empty from 'frampton-signals/empty';
import { nextEvent } from 'frampton-signals/event';

QUnit.module('Frampton.Signals.count');

QUnit.test('should count the number of occurances of a stream', function() {
  var stream = empty();
  var behavior = count(stream);
  var i = 0;
  behavior.changes((val) => {
    if (i === 0) {
      equal(val, 0, 'initial value is 0');
    } else {
      equal(val, 1, 'first occurance count is 1');
    }
    i = i + 1;
  });
  stream.push(nextEvent('test'));
});