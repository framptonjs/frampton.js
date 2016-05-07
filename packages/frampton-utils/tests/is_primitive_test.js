import isPrimitive from 'frampton-utils/is_primitive';

QUnit.module('Frampton.Utils.isPrimitive');

QUnit.test('Should return true for strings', function() {
  ok(isPrimitive('test'));
});

QUnit.test('Should return true for numbers', function() {
  ok(isPrimitive(33));
});

QUnit.test('Should return true for booleans', function() {
  ok(isPrimitive(false));
});

QUnit.test('Should return false for objects', function() {
  notOk(isPrimitive({ test : 'this' }));
});

QUnit.test('Should return false for arrays', function() {
  notOk(isPrimitive([1,2,3]));
});