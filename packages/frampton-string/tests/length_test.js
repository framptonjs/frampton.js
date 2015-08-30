import length from 'frampton-string/length';

QUnit.module('Frampton.String.length');

QUnit.test('should return the correct length of string', function() {
  equal(length('yep'), 3);
});

QUnit.test('should return the correct length of string with newlines', function() {
  equal(length('yep\r\nnope'), 8);
  equal(length('yep\nnope'), 8);
});

QUnit.test('should return the correct length of string with trailing newlines', function() {
  equal(length('yep\r\nnope\r\n'), 9);
  equal(length('yep\nnope\n'), 9);
});