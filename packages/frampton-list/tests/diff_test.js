import diff from 'frampton-list/diff';

QUnit.module('Frampton.List.diff');

QUnit.test('Should return array of all values from first array not in second', function(assert) {
  const xs = [8,6,9,1,0,3];
  const ys = [8,5,1,9,2];
  const actual = diff(xs, ys);
  const expected = [6,0,3];
  assert.deepEqual(actual, expected, 'has correct values');
});
