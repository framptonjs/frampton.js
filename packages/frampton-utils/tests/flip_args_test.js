import flipArgs from 'frampton-utils/flip_args';

QUnit.module('Frampton.Utils.flipArgs');

QUnit.test('Should reverse the arguments to a function', function(assert) {
  const fn = (a, b, c) => {
    return c - b - a;
  };

  const flipped = flipArgs(fn);

  assert.equal(fn(1, 2, 4), 1);
  assert.equal(flipped(1, 2, 4), -5);
});
