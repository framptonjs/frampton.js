import reverse from 'frampton-list/reverse';

QUnit.module('Frampton.List.reverse');

QUnit.test('Should return a new array values of given array reversed', () => {
  const xs = [1,2,3];
  const ys = reverse(xs);
  notEqual(xs, ys, 'is not the same reference');
  deepEqual(ys, [3,2,1], 'has correct values');
});