import drop from 'frampton-list/drop';

QUnit.module('Frampton.List.drop');

QUnit.test('returns a new array with the first n elements removed', function(assert) {
  const xs = [1,2,3,4,5];
  const actual = drop(2, xs);
  const expected = [3,4,5];
  assert.deepEqual(actual, expected, 'has correct values');
});
