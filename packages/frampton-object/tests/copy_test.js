import copy from 'frampton-object/copy';

QUnit.module('Frampton.Object.copy');

QUnit.test('returns a copy of an object', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const newObj = copy(obj);
  assert.deepEqual(obj, newObj);
});

QUnit.test('returns a new reference', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const newObj = copy(obj);
  assert.notEqual(obj, newObj);
});
