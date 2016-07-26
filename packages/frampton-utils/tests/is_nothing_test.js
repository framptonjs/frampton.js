import isNothing from 'frampton-utils/is_nothing';

QUnit.module('Frampton.Utils.isNothing');

QUnit.test('Should return true for null', function(assert) {
  const temp = null;
  assert.ok(isNothing(temp));
});

QUnit.test('Should return true for undefined', function(assert) {
  var temp;
  assert.ok(isNothing(temp));
});

QUnit.test('Should return false for strings', function(assert) {
  const temp = 'test';
  assert.notOk(isNothing(temp));
});

QUnit.test('Should return false for numbers', function(assert) {
  const temp = 10;
  assert.notOk(isNothing(temp));
});

QUnit.test('Should return false for booleans', function(assert) {
  const temp = false;
  const temp2 = true;
  assert.notOk(isNothing(temp));
  assert.notOk(isNothing(temp2));
});

QUnit.test('Should return false for objects', function(assert) {
  const temp = {};
  assert.notOk(isNothing(temp));
});
