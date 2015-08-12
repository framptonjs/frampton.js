import eventValue from 'frampton-events/event_value';

QUnit.module('Frampton.Events.eventValue');

QUnit.test('should return value property of event target', function() {
  equal(eventValue({ target: { value: 'test' } }), 'test');
});