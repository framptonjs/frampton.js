import prepend from 'frampton-list/prepend';

QUnit.module('Frampton.List.prepend');

QUnit.test('Should return an array with value prepended', function(assert) {
  const xs = [1,2,3];
  const actual = prepend(xs, 0);
  const expected = [0,1,2,3];
  assert.deepEqual(actual, expected, 'has correct values');
});

QUnit.test('Should return a new reference', function(assert) {
  const xs = [1,2,3];
  const ys = prepend(xs, 0);
  assert.notEqual(xs, ys, 'is not the same reference');
});
