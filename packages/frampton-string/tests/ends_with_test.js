import endsWith from 'frampton-string/ends_with';

QUnit.module('Frampton.String.endsWith');

QUnit.test('returns true if a string ends with a substring', function(assert) {
  assert.ok(endsWith('nope', 'yepnope'), 'correctly recognizes substring');
});

QUnit.test('returns false if a string does not end with a substring', function(assert) {
  assert.notOk(endsWith('yep', 'yepnope'), 'correctly recognizes substring');
});
