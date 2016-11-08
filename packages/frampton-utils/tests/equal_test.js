import equal from 'frampton-utils/equal';

QUnit.module('Frampton.Utils.equal');

QUnit.test('returns true for objects with same key/values', function(assert) {
  var a = { a: 1, b: 2 };
  var b = { a: 1, b: 2 };
  assert.ok(equal(a, b), 'correctly compares objects');
});

QUnit.test('returns false for objects with different key/values', function(assert) {
  var a = { a: 1, b: 2 };
  var b = { a: 2, b: 1 };
  assert.notOk(equal(a, b), 'correctly compares objects');
});

QUnit.test('returns true for objects with the same nested values', function(assert) {
  var a = { a: { x: 1, y: { r: 'one', s: 'three'}}, b: 2 };
  var b = { a: { x: 1, y: { r: 'one', s: 'three'}}, b: 2 };
  assert.ok(equal(a, b), 'correctly compares objects');
});

QUnit.test('returns false for objects with different nested values', function(assert) {
  var a = { a: { x: 1, y: { r: 'one', s: 'four'}}, b: 2 };
  var b = { a: { x: 1, y: { r: 'one', s: 'three'}}, b: 2 };
  assert.notOk(equal(a, b), 'correctly compares objects');
});

QUnit.test('returns true for objects with the same nested null values', function(assert) {
  var a = { a: { x: 1, y: { r: 'one', s: null}}, b: 2 };
  var b = { a: { x: 1, y: { r: 'one', s: null}}, b: 2 };
  assert.ok(equal(a, b), 'correctly compares objects');
});

QUnit.test('returns false for objects with different nested null values', function(assert) {
  var a = { a: { x: 1, y: { r: 'one', s: 'four'}}, b: 2 };
  var b = { a: { x: 1, y: { r: 'one', s: null}}, b: 2 };
  assert.notOk(equal(a, b), 'correctly compares objects');
});

QUnit.test('returns reference equality for objects with circular references', function(assert) {

  const a = {};
  const b = {};

  a.a = 1;
  a.b = 2;
  a.c = a;

  b.a = 1;
  b.b = 2;
  b.c = b;

  assert.notOk(equal(a, b), 'correctly compares different objects');
  assert.ok(equal(a, a), 'correctly compares same object');
});

QUnit.test('returns false for objects with different keys', function(assert) {
  var a = { a: { x: 1, y: { r: 'one', s: 'four'}}, b: 2 };
  var b = { a: { x: 1, y: { r: 'one', t: 'four'}}, b: 2 };
  assert.notOk(equal(a, b), 'correctly compares objects');
});

QUnit.test('returns true for the same primitive value', function(assert) {
  var a = 1;
  var b = 1;
  assert.ok(equal(a, b), 'correctly compares values');
});

QUnit.test('returns false for different primitive values', function(assert) {
  var a = 1;
  var b = 2;
  assert.notOk(equal(a, b), 'correctly compares values');
});
