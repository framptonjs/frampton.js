import remove from 'frampton-list/remove';

QUnit.module('Frampton.List.remove');

QUnit.test('Should return a new array with the given value removed', function(assert) {
  const xs = [1,2,3];
  const actual = remove(1, xs);
  const expected = [2, 3];
  assert.deepEqual(actual, expected);
});

QUnit.test('Should not modiby original array', function(assert) {
  const xs = [1,2,3];
  remove(1, xs);
  assert.deepEqual(xs, [1,2,3]);
});
