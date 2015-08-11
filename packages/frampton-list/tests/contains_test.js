import contains from 'frampton-list/contains';

QUnit.module('Frampton.List.contains');

QUnit.test('should return true if a list contains a value', function() {
  var xs = [1,2,3];
  ok(contains(xs, 3), 'correctly detected value');
});

QUnit.test('should return false if a list does not contain a value', function() {
  var xs = [1,2,3];
  notOk(contains(xs, 5), 'correctly detected value');
});