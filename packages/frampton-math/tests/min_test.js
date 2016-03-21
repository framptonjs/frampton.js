import min from 'frampton-math/min';

QUnit.module('Frampton.Math.min');

QUnit.test('should correctly select the smaller of two numbers', function() {
  equal(min(4,2), 2);
});