import removeIndex from 'frampton-list/remove_index';

QUnit.module('Frampton.List.removeIndex');

QUnit.test('returns a new array with the given index removed', function(assert) {
  const xs = ['one', 'two', 'three'];
  const actual = removeIndex(1, xs);
  const expected = ['one', 'three'];
  assert.deepEqual(actual, expected);
});

QUnit.test('does not modify original array', function(assert) {
  const xs = ['one', 'two', 'three'];
  const expected = ['one', 'two', 'three'];
  removeIndex(1, xs);
  assert.deepEqual(xs, expected);
});
