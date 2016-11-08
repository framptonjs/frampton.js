import merge from 'frampton-object/merge';

QUnit.module('Frampton.Object.merge');

QUnit.test('creates a new object with values from two objects', function(assert) {
  const obj = { one: 1, two: 2 };
  const obj2 = { three: 3, four: 4 };
  const actual = merge(obj, obj2);
  const expected = { one: 1, two: 2, three: 3, four: 4 };
  assert.deepEqual(actual, expected);
});

QUnit.test('gives second object precidence', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const obj2 = { three: 33, four: 4 };
  const actual = merge(obj, obj2);
  const expected = { one: 1, two: 2, three: 33, four: 4 };
  assert.deepEqual(actual, expected);
});

QUnit.test('ignores nulls', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const obj2 = null;
  const actual = merge(obj, obj2);
  const expected = { one: 1, two: 2, three: 3 };
  assert.deepEqual(actual, expected);
});
