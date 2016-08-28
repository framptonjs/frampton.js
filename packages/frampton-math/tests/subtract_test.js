import sub from 'frampton-math/subtract';

QUnit.module('Frampton.Math.subtract');

QUnit.test('should correctly subtract two numbers', function(assert) {
  const actual = sub(7, 2);
  const expected = 5;
  assert.equal(actual, expected);
});
