import replace from 'frampton-list/replace';

QUnit.module('Frampton.List.replace');

QUnit.test('Should replace old object with new object', function(assert) {
  const xs = [1, 2, 3];
  const actual = replace(1, 9, xs);
  const expected = [9, 2, 3];
  assert.deepEqual(actual, expected);
});

QUnit.test('Should return original array if object missing', function(assert) {
  const xs = [1, 2, 3];
  const actual = replace(10, 9, xs);
  const expected = [1, 2, 3];
  assert.deepEqual(actual, expected);
});

QUnit.test('Should rnot modify original array', function(assert) {
  const xs = [1, 2, 3];
  replace(1, 9, xs);
  assert.deepEqual(xs, [1, 2, 3]);
});
