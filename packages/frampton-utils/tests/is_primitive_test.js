import isPrimitive from 'frampton-utils/is_primitive';

QUnit.module('Frampton.Utils.isPrimitive');

QUnit.test('returns true for strings', function(assert) {
  assert.ok(isPrimitive('test'));
});

QUnit.test('returns true for numbers', function(assert) {
  assert.ok(isPrimitive(33));
});

QUnit.test('returns true for booleans', function(assert) {
  assert.ok(isPrimitive(false));
});

QUnit.test('returns false for objects', function(assert) {
  assert.notOk(isPrimitive({ test : 'this' }));
});

QUnit.test('returns false for arrays', function(assert) {
  assert.notOk(isPrimitive([1,2,3]));
});
