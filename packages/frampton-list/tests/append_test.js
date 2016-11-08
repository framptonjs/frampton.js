import append from 'frampton-list/append';

QUnit.module('Frampton.List.append');

QUnit.test('returns a new array with value appended', function(assert) {
  const xs = [1,2,3];
  const actual = append(xs, 4);
  const expected = [1,2,3,4];
  assert.deepEqual(actual, expected, 'has correct values');
});

QUnit.test('returns a new reference', function(assert) {
  const xs = [1,2,3];
  const ys = append(xs, 4);
  assert.notEqual(xs, ys, 'is not the same reference');
});
