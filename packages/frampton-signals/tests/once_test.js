import once from 'frampton-signals/once';

QUnit.module('Frampton.Signals.once');

QUnit.test('should create event stream with initial value', function() {
  var stream = once(1);
  stream.next((val) => {
    equal(val, 1);
  });
});