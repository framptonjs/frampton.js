import max from 'frampton-math/max';

QUnit.module('Frampton.Math.max');

QUnit.test('should correctly select the larger of two numbers', function() {
  equal(max(4,2), 4);
});