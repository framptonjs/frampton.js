import zip from 'frampton-list/zip';

QUnit.module('Frampton.List.zip');

QUnit.test('should combine two arrays into an array of pairs', () => {
  var xs = [1,2,3];
  var ys = [4,5,6];
  deepEqual(zip(xs,ys), [[1,4],[2,5],[3,6]]);
});