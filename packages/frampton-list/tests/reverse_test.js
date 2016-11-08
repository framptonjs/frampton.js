import reverse from 'frampton-list/reverse';

QUnit.module('Frampton.List.reverse');

QUnit.test('reverses values of array', function(assert) {
  const xs = [1,2,3];
  const actual = reverse(xs);
  const expected = [3,2,1];
  assert.deepEqual(actual, expected, 'has correct values');
});

QUnit.test('returns a new reference', function(assert) {
  const xs = [1,2,3];
  const ys = reverse(xs);
  assert.notEqual(xs, ys, 'is not the same reference');
});
