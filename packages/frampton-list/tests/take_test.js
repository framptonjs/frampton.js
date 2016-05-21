import take from 'frampton-list/take';

QUnit.module('Frampton.List.take');

QUnit.test('Should return a new array with the first n elements of given list', function() {
  const xs = [1,2,3,4,5,6];
  deepEqual(take(3, xs), [1,2,3]);
});

QUnit.test('Should return all elements in list if in is larger than list length', function() {
  const xs = [1,2];
  deepEqual(take(6, xs), [1,2]);
});
