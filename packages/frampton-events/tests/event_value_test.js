import eventValue from 'frampton-events/event_value';

QUnit.module('Frampton.Events.eventValue');

QUnit.test('returns value property of event target', function(assert) {
  const mockEvent = { target: { value : 'test' } };
  const actual = eventValue(mockEvent);
  const expected = 'test';
  assert.equal(actual, expected);
});
