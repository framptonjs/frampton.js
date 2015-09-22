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

QUnit.test('should return true for objects with the same nested values', function() {
  var a = { a: { x: 1, y: { r: 'one', s: 'three'}}, b: 2 };
  var b = { a: { x: 1, y: { r: 'one', s: 'three'}}, b: 2 };
  ok(equal(a, b), 'correctly compares objects');
});

QUnit.test('should return false for objects with different nested values', function() {
  var a = { a: { x: 1, y: { r: 'one', s: 'four'}}, b: 2 };
  var b = { a: { x: 1, y: { r: 'one', s: 'three'}}, b: 2 };
  notOk(equal(a, b), 'correctly compares objects');
});

QUnit.test('should return true for objects with the same nested null values', function() {
  var a = { a: { x: 1, y: { r: 'one', s: null}}, b: 2 };
  var b = { a: { x: 1, y: { r: 'one', s: null}}, b: 2 };
  ok(equal(a, b), 'correctly compares objects');
});

QUnit.test('should return false for objects with different nested null values', function() {
  var a = { a: { x: 1, y: { r: 'one', s: 'four'}}, b: 2 };
  var b = { a: { x: 1, y: { r: 'one', s: null}}, b: 2 };
  notOk(equal(a, b), 'correctly compares objects');
});

QUnit.test('should return reference equality for objects with circular references', function() {

  var a = {},
      b = {};

  a.a = 1;
  a.b = 2;
  a.c = a;

  b.a = 1;
  b.b = 2;
  b.c = b;

  notOk(equal(a, b), 'correctly compares different objects');
  ok(equal(a, a), 'correctly compares same object');
});

QUnit.test('should return false for objects with different keys', function() {
  var a = { a: { x: 1, y: { r: 'one', s: 'four'}}, b: 2 };
  var b = { a: { x: 1, y: { r: 'one', t: 'four'}}, b: 2 };
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