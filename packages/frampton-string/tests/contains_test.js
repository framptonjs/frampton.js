import contains from 'frampton-string/contains';

QUnit.module('Frampton.String.contains');

QUnit.test('returns true if a string contains a substring', function() {
  ok(contains('yep', 'yepnope'), 'correctly recognizes substring');
});

QUnit.test('returns false if a string does not contain substring', function() {
  notOk(contains('wrong', 'yepnope'), 'correctly recognizes substring');
});