import add from 'frampton-list/add';

QUnit.module('Frampton.List.add');

QUnit.test('should return a new array with value added', function() {
  var xs = [1,2,3];
  var ys = add(xs, 4);
  notEqual(xs, ys, 'is not the same reference');
  deepEqual(ys, [1,2,3,4], 'has correct values');
});

QUnit.test('should not add the value if array already contains it', function() {
  var xs = [1,2,3];
  var ys = add(xs, 3);
  notEqual(xs, ys, 'is not the same reference');
  deepEqual(ys, [1,2,3], 'has correct values');
});