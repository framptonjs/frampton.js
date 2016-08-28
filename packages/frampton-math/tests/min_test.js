import min from 'frampton-math/min';

QUnit.module('Frampton.Math.min');

QUnit.test('should correctly select the smaller of two numbers', function(assert) {
  const actual = min(4, 2);
  const expected = 2;
  assert.equal(actual, expected);
});
