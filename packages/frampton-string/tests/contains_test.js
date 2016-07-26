import contains from 'frampton-string/contains';

QUnit.module('Frampton.String.contains');

QUnit.test('returns true if a string contains a substring', function(assert) {
  assert.ok(contains('yep', 'yepnope'), 'correctly recognizes substring');
});

QUnit.test('returns false if a string does not contain substring', function(assert) {
  assert.notOk(contains('wrong', 'yepnope'), 'correctly recognizes substring');
});
