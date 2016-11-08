import add from 'frampton-math/add';

QUnit.module('Frampton.Math.add');

QUnit.test('adds two numbers', function(assert) {
  const actual = add(1, 2);
  const expected = 3;
  assert.equal(actual, expected);
});
