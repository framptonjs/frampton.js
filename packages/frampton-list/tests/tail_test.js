import tail from 'frampton-list/tail';

QUnit.module('Frampton.List.tail');

QUnit.test('returns new array with all but first element', function(assert) {
  const xs = [1,2,3];
  const actual = tail(xs);
  const expected = [2, 3];
  assert.deepEqual(actual, expected);
});
