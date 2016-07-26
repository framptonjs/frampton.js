import startsWith from 'frampton-string/starts_with';

QUnit.module('Frampton.String.startsWith');

QUnit.test('returns true if a string starts with a substring', function(assert) {
  assert.ok(startsWith('yep', 'yepnope'), 'correctly recognizes substring');
});

QUnit.test('returns false if a string does not start with a substring', function(assert) {
  assert.notOk(startsWith('nope', 'yepnope'), 'correctly recognizes substring');
});
