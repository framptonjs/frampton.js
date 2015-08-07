import equal from 'frampton-utils/equal';

QUnit.module('Frampton.Utils.equal');

QUnit.test('should return true for objects with same key/values', function() {
  var a = { a: 1, b: 2 };
  var b = { a: 1, b: 2 };
  ok(equal(a, b), 'correctly compares objects');
});

QUnit.test('should return false for objects with different key/values', function() {
  var a = { a: 1, b: 2 };
  var b = { a: 2, b: 1 };
  notOk(equal(a, b), 'correctly compares objects');
});

QUnit.test('should return true for the same primitive value', function() {
  var a = 1;
  var b = 1;
  ok(equal(a, b), 'correctly compares values');
});

QUnit.test('should return false for different primitive values', function() {
  var a = 1;
  var b = 2;
  notOk(equal(a, b), 'correctly compares values');
});