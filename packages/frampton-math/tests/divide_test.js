import divide from 'frampton-math/divide';

QUnit.module('Frampton.Math.divide');

QUnit.test('should correctly divide two numbers', function(assert) {
  assert.equal(divide(4,2), 2);
});
