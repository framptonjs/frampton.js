import lazy from 'frampton-utils/lazy';

QUnit.module('Frampton.Utils.lazy');

QUnit.test('Should return a function that applies args to given function', function() {
  const test = lazy((x, y) => x + y, [3, 7]);
  equal(test(), 10);
});

QUnit.test('Should return a curried function', function() {
  const test = lazy((x, y) => x + y);
  equal(test([4,5])(), 9);
});