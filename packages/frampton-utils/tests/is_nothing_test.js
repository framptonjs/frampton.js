import isNothing from 'frampton-utils/is_nothing';

QUnit.module('Frampton.Utils.isNothing');

QUnit.test('returns true for null', function(assert) {
  const temp = null;
  assert.ok(isNothing(temp));
});

QUnit.test('returns true for undefined', function(assert) {
  var temp;
  assert.ok(isNothing(temp));
});

QUnit.test('returns false for strings', function(assert) {
  const temp = 'test';
  assert.notOk(isNothing(temp));
});

QUnit.test('returns false for numbers', function(assert) {
  const temp = 10;
  assert.notOk(isNothing(temp));
});

QUnit.test('returns false for booleans', function(assert) {
  const temp = false;
  const temp2 = true;
  assert.notOk(isNothing(temp));
  assert.notOk(isNothing(temp2));
});

QUnit.test('returns false for objects', function(assert) {
  const temp = {};
  assert.notOk(isNothing(temp));
});
