import zip from 'frampton-list/zip';

QUnit.module('Frampton.List.zip');

QUnit.test('combines two arrays into an array of pairs', function(assert) {
  const xs = [1,2,3];
  const ys = [4,5,6];
  const actual = zip(xs,ys);
  const expected = [[1,4],[2,5],[3,6]];
  assert.deepEqual(actual, expected);
});
