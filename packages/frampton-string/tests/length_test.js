import length from 'frampton-string/length';

QUnit.module('Frampton.String.length');

QUnit.test('returns the correct length of string', function(assert) {
  assert.equal(length('yep'), 3);
});

QUnit.test('returns the correct length of string with newlines', function(assert) {
  assert.equal(length('yep\r\nnope'), 8);
  assert.equal(length('yep\nnope'), 8);
});

QUnit.test('returns the correct length of string with trailing newlines', function(assert) {
  assert.equal(length('yep\r\nnope\r\n'), 9);
  assert.equal(length('yep\nnope\n'), 9);
});
