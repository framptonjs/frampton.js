import third from 'frampton-list/third';

QUnit.module('Frampton.List.third');

QUnit.test('Should return third item in array', () => {
  var xs = [1,2,3];
  equal(third(xs), 3);
});