import values from 'frampton-record/values';

QUnit.module('Frampton.Record.values');

QUnit.test('Should return an array of object values', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const actual = values(obj);
  const expected = [1, 2, 3];
  assert.deepEqual(actual, expected);
});

QUnit.test('Should return empty array for null', function(assert) {
  const obj = null;
  const actual = values(obj);
  const expected = [];
  assert.deepEqual(actual, expected);
});
