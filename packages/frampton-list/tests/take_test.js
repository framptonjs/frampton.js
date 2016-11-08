import take from 'frampton-list/take';

QUnit.module('Frampton.List.take');

QUnit.test('returns a new array with the first n elements of given list', function(assert) {
  const xs = [1,2,3,4,5,6];
  const actual = take(3, xs);
  const expected = [1,2,3];
  assert.deepEqual(actual, expected);
});

QUnit.test('returns all elements in list if in is larger than list length', function(assert) {
  const xs = [1,2];
  const actual = take(6, xs);
  const expected = [1,2];
  assert.deepEqual(actual, expected);
});
