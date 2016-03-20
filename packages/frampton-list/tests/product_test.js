import product from 'frampton-list/product';

QUnit.module('Frampton.List.product');

QUnit.test('Should return product of elements in a list', () => {
  const xs = [2,4,6];
  equal(product(xs), 48);
});