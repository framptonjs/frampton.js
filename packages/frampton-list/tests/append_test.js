import append from 'frampton-list/append';

QUnit.module('Frampton.List.append');

QUnit.test('should return a new array with value appended', function() {
  var xs = [1,2,3];
  var ys = append(xs, 4);
  notEqual(xs, ys, 'is not the same reference');
  deepEqual(ys, [1,2,3,4], 'has correct values');
});