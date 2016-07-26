import capitalize from 'frampton-string/capitalize';

QUnit.module('Frampton.String.capitalize');

QUnit.test('should correctly capitalize a string', function(assert) {
  assert.equal(capitalize('test'), 'Test');
});
