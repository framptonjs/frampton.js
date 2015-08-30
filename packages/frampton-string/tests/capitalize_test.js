import capitalize from 'frampton-string/capitalize';

QUnit.module('Frampton.String.capitalize');

QUnit.test('should correctly capitalize a string', function() {
  equal(capitalize('test'), 'Test');
});