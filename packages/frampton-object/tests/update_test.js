import update from 'frampton-object/update';

QUnit.module('Frampton.Object.update');

QUnit.test('updates specified keys', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const actual = update(obj, { one : 3 });
  const expected = { one : 3, two : 2, three : 3 };
  assert.deepEqual(actual, expected);
});

QUnit.test('returns a new instance', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const newObj = update(obj, { one : 3 });
  assert.ok(obj !== newObj);
});
