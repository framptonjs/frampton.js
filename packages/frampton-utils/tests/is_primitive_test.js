import isPrimitive from 'frampton-utils/is_primitive';

QUnit.module('Frampton.Utils.isPrimitive');

QUnit.test('Should return true for strings', function(assert) {
  assert.ok(isPrimitive('test'));
});

QUnit.test('Should return true for numbers', function(assert) {
  assert.ok(isPrimitive(33));
});

QUnit.test('Should return true for booleans', function(assert) {
  assert.ok(isPrimitive(false));
});

QUnit.test('Should return false for objects', function(assert) {
  assert.notOk(isPrimitive({ test : 'this' }));
});

QUnit.test('Should return false for arrays', function(assert) {
  assert.notOk(isPrimitive([1,2,3]));
});
