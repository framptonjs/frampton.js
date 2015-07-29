import {
  endsWith
} from 'frampton-string';

QUnit.module('Frampton.String.endsWith');

QUnit.test('returns true if a string ends with a substring', function() {
  ok(endsWith('nope', 'yepnope'), 'correctly recognizes substring');
});

QUnit.test('returns false if a string does not end with a substring', function() {
  notOk(endsWith('yep', 'yepnope'), 'correctly recognizes substring');
});