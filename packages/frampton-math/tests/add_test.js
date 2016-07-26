import add from 'frampton-math/add';

QUnit.module('Frampton.Math.add');

QUnit.test('should correctly add two numbers', function(assert) {
  assert.equal(add(1, 2), 3);
});
