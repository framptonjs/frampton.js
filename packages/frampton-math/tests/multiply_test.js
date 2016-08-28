import multiply from 'frampton-math/multiply';

QUnit.module('Frampton.Math.multiply');

QUnit.test('should correctly multiply two numbers', function(assert) {
  const actual = multiply(4, 2);
  const expected = 8;
  assert.equal(actual, expected);
});
