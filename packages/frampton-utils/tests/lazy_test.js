import lazy from 'frampton-utils/lazy';

QUnit.module('Frampton.Utils.lazy');

QUnit.test('returns a function that applies args to given function', function(assert) {
  const test = lazy((x, y) => x + y, [3, 7]);
  assert.equal(test(), 10);
});

QUnit.test('returns a curried function', function(assert) {
  const test = lazy((x, y) => x + y);
  assert.equal(test([4,5])(), 9);
});
