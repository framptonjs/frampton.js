import sub from 'frampton-math/subtract';

QUnit.module('Frampton.Math.subtract');

QUnit.test('should correctly subtract two numbers', function() {
  equal(sub(7,2), 5);
});