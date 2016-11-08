import split from 'frampton-list/split';

QUnit.module('Frampton.List.split');

QUnit.test('splits an array at given index, returning two new arrays', function(assert) {
  const xs = [1,2,3,4,5,6];
  const actual = split(3,xs);
  const expected = [[1,2,3],[4,5,6]];
  assert.deepEqual(actual, expected);
});
