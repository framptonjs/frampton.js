import prepend from 'frampton-list/prepend';

QUnit.module('Frampton.List.prepend');

QUnit.test('should return a new array with value prepended', () => {
  var xs = [1,2,3];
  var ys = prepend(xs, 0);
  notEqual(xs, ys, 'is not the same reference');
  deepEqual(ys, [0,1,2,3], 'has correct values');
});