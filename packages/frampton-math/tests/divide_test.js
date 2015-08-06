import divide from 'frampton-math/divide';

QUnit.module('Frampton.Math.divide');

QUnit.test('should correctly divide two numbers', function() {
  equal(divide(4,2), 2, 'correctly divides');
});