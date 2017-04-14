import set from 'frampton-object/set';

QUnit.module('Frampton.Object.set');

QUnit.test('sets the new value for key', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const actual = set('one', 2, obj);
  const expected = { one: 2, two: 2, three: 3 };
  assert.deepEqual(actual, expected);
});

QUnit.test('returns a new instance', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const newObj = set('one', 2, obj);
  assert.ok(obj !== newObj);
});

QUnit.test('sets the new value for nested key', function(assert) {
  const obj = { one: 1, two: { foo: 4 }, three: 3 };
  const actual = set('two.foo', 2, obj);
  const expected = { one: 1, two: { foo: 2 }, three: 3 };
  assert.deepEqual(actual, expected);
});

QUnit.test('adds values on missing path', function(assert) {
  const obj = {};
  const actual = set('two', 2, obj);
  const expected = { two: 2 };
  assert.deepEqual(actual, expected);
});

QUnit.test('adds values on a nested missing path', function(assert) {
  const obj = { one: { two: {} } };
  const actual = set('one.three', 3, obj);
  const expected = { one: { two: {}, three: 3 } };
  assert.deepEqual(actual, expected);
});

QUnit.test('returns new instance', function(assert) {
  const obj = { one: 1, two: { foo: {} }, three: { back: 'back' }};
  const newObj = set('two.foo.bar', 2, obj);
  assert.ok(obj !== newObj);
});
