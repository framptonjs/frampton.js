import flipArgs from 'frampton-utils/flip_args';

QUnit.module('Frampton.Utils.flipArgs');

QUnit.test('reverses the arguments to a function', function(assert) {
  const fn = (a, b) => {
    return b - a;
  };

  const flipped = flipArgs(fn);

  assert.equal(fn(1, 2), 1);
  assert.equal(flipped(1, 2), -1);
});
