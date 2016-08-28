import max from 'frampton-math/max';

QUnit.module('Frampton.Math.max');

QUnit.test('should correctly select the larger of two numbers', function(assert) {
  const actual = max(4, 2);
  const expected = 4;
  assert.equal(actual, expected);
});
