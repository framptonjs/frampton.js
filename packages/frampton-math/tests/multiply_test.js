import multiply from 'frampton-math/multiply';

QUnit.module('Frampton.Math.multiply');

QUnit.test('should correctly multiply two numbers', function() {
  equal(multiply(4,2), 8, 'correctly multiplies');
});