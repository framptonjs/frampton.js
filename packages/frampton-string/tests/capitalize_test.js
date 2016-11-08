import capitalize from 'frampton-string/capitalize';

QUnit.module('Frampton.String.capitalize');

QUnit.test('correctly capitalizes a string', function(assert) {
  assert.equal(capitalize('test'), 'Test');
});
