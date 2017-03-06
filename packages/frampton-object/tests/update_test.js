import update from 'frampton-object/update';

QUnit.module('Frampton.Object.update');

QUnit.test('updates specified keys', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const actual = update(obj, { one : 3 });
  const expected = { one : 3, two : 2, three : 3 };
  assert.deepEqual(actual, expected);
});

QUnit.test('updates nested values', function(assert) {
  const obj = { one: 1, two: { four: 4, five: 5, six: 6 } };
  const actual = update(obj, { two: { five: 8 } });
  const expected = { one: 1, two: { four: 4, five: 8, six: 6 } };
  assert.deepEqual(actual, expected);
});

QUnit.test('ignores undefined keys', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const actual = update(obj, { one : 3, two: undefined });
  const expected = { one : 3, two : 2, three : 3 };
  assert.deepEqual(actual, expected);
});

QUnit.test('adds values in previously undefined keys', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const actual = update(obj, { one: 3, five : 5, six: { seven: 7 } });
  const expected = { one : 3, two : 2, three : 3, five: 5, six: { seven: 7 } };
  assert.deepEqual(actual, expected);
});

QUnit.test('works with falsy values', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const actual = update(obj, { one : 3, two: false });
  const expected = { one : 3, two : false, three : 3 };
  assert.deepEqual(actual, expected);
});

QUnit.test('returns a new instance', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const newObj = update(obj, { one : 3 });
  assert.ok(obj !== newObj);
});
