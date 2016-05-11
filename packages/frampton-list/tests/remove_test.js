import remove from 'frampton-list/remove';

QUnit.module('Frampton.List.remove');

QUnit.test('Should return a new array with the given value removed', function() {
  const xs = [1,2,3];
  deepEqual(remove(1, xs), [2,3]);
});

QUnit.test('Should not modiby original array', function() {
  const xs = [1,2,3];
  remove(1, xs);
  deepEqual(xs, [1,2,3]);
});