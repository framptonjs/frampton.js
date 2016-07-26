import replace from 'frampton-list/replace_index';

QUnit.module('Frampton.List.replaceIndex');

QUnit.test('Should replace object at given index with new object', function(assert) {
  const xs = [1, 2, 3];
  const actual = replace(1, 9, xs);
  const expected = [1, 9, 3];
  assert.deepEqual(actual, expected);
});

QUnit.test('Should not modify original array', function(assert) {
  const xs = [1, 2, 3];
  replace(1, 9, xs);
  assert.deepEqual(xs, [1, 2, 3]);
});
