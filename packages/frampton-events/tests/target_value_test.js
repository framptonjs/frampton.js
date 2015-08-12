import targetValue from 'frampton-events/target_value';

QUnit.module('Frampton.Events.targetValue');

QUnit.test('should return value property of given object', function() {
  equal(targetValue({ value: 'test' }), 'test');
});