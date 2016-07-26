import multiply from 'frampton-math/multiply';

QUnit.module('Frampton.Math.multiply');

QUnit.test('should correctly multiply two numbers', function(assert) {
  assert.equal(multiply(4,2), 8);
});
