import compose from 'frampton-utils/compose';

QUnit.module('Frampton.Utils.compose');

QUnit.test('should compose functions right to left', function() {
  var a = function(x) { return (x + 'a'); };
  var b = function(x) { return (x + 'b'); };
  equal(compose(a, b)('c'), 'cba', 'correctly composes functions');
});

QUnit.test('does not compose functions left to right', function() {
  var a = function(x) { return (x + 'a'); };
  var b = function(x) { return (x + 'b'); };
  notEqual(compose(a, b)('c'), 'abc', 'correctly composes functions');
});