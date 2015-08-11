import diff from 'frampton-list/diff';

QUnit.module('Frampton.List.diff');

QUnit.test('should return array of all values from first array not in second', function() {
  var xs = [1,2,3];
  var ys = [2,3,4];
  deepEqual(diff(xs, ys), [1], 'has correct values');
  deepEqual(diff(ys, xs), [4], 'has correct values');
});