import prepend from 'frampton-list/prepend';

QUnit.module('Frampton.List.prepend');

QUnit.test('returns an array with value prepended', function(assert) {
  const xs = [1,2,3];
  const actual = prepend(0, xs);
  const expected = [0,1,2,3];
  assert.deepEqual(actual, expected, 'has correct values');
});

QUnit.test('returns a new reference', function(assert) {
  const xs = [1,2,3];
  const ys = prepend(0, xs);
  assert.notEqual(xs, ys, 'is not the same reference');
});
