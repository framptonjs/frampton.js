import isSomething from 'frampton-utils/is_something';

QUnit.module('Frampton.Utils.isSomething');

QUnit.test('Should return false for null', function() {
  const temp = null;
  notOk(isSomething(temp));
});

QUnit.test('Should return false for undefined', function() {
  var temp;
  notOk(isSomething(temp));
});

QUnit.test('Should return true for strings', function() {
  const temp = 'test';
  ok(isSomething(temp));
});

QUnit.test('Should return true for numbers', function() {
  const temp = 10;
  ok(isSomething(temp));
});

QUnit.test('Should return true for booleans', function() {
  const temp = false;
  const temp2 = true;
  ok(isSomething(temp));
  ok(isSomething(temp2));
});

QUnit.test('Should return true for objects', function() {
  const temp = {};
  ok(isSomething(temp));
});