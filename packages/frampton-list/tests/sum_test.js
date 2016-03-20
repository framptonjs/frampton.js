import sum from 'frampton-list/sum';

QUnit.module('Frampton.List.sum');

QUnit.test('Should return sum of elements in a list', () => {
  const xs = [1,2,3];
  equal(sum(xs), 6);
});