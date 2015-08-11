import reverse from 'frampton-list/reverse';

QUnit.module('Frampton.List.reverse');

QUnit.test('should return a new array values of given array reversed', () => {
  var xs = [1,2,3];
  var ys = reverse(xs);
  notEqual(xs, ys, 'is not the same reference');
  deepEqual(ys, [3,2,1], 'has correct values');
});