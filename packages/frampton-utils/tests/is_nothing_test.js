import isNothing from 'frampton-utils/is_nothing';

QUnit.module('Frampton.Utils.isNothing');

QUnit.test('Should return true for null', function() {
  const temp = null;
  ok(isNothing(temp));
});

QUnit.test('Should return true for undefined', function() {
  var temp;
  ok(isNothing(temp));
});

QUnit.test('Should return false for strings', function() {
  const temp = 'test';
  notOk(isNothing(temp));
});

QUnit.test('Should return false for numbers', function() {
  const temp = 10;
  notOk(isNothing(temp));
});

QUnit.test('Should return false for booleans', function() {
  const temp = false;
  const temp2 = true;
  notOk(isNothing(temp));
  notOk(isNothing(temp2));
});

QUnit.test('Should return false for objects', function() {
  const temp = {};
  notOk(isNothing(temp));
});