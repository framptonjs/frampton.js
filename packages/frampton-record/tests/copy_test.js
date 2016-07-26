import copy from 'frampton-record/copy';

QUnit.module('Frampton.Record.copy');

QUnit.test('Should return a copy of an object', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const newObj = copy(obj);
  assert.deepEqual(obj, newObj);
});

QUnit.test('Should return a new reference', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const newObj = copy(obj);
  assert.notEqual(obj, newObj);
});
