import set from 'frampton-object/set';

QUnit.module('Frampton.Object.set');

QUnit.test('Should correctly set the new value for key', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const actual = set('one', 2, obj);
  const expected = { one : 2, two : 2, three : 3 };
  assert.deepEqual(actual, expected);
});

QUnit.test('Should return a new instance', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const newObj = set('one', 2, obj);
  assert.ok(obj !== newObj);
});
