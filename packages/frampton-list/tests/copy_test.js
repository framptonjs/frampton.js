import copy from 'frampton-list/copy';

QUnit.module('Frampton.List.copy');

QUnit.test('should return a new object', function() {
  var xs = [1,2,3];
  var ys = copy(xs);
  notEqual(xs, ys, 'is not the same reference');
});

QUnit.test('should return an array with the values of the given array', function() {
  var xs = [1,2,3];
  var ys = copy(xs);
  deepEqual(ys, xs, 'has correct values');
});