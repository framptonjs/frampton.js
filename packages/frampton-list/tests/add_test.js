import add from 'frampton-list/add';

QUnit.module('Frampton.List.add');

QUnit.test('Should return a new array with value added', function(assert) {
  const xs = [1,2,3];
  const actual = add(xs, 4);
  const expected = [1,2,3,4];
  assert.deepEqual(actual, expected, 'has correct values');
});

QUnit.test('Should not add the value if array already contains it', function(assert) {
  const xs = [1,2,3];
  const actual = add(xs, 3);
  const expected = [1,2,3];
  assert.deepEqual(actual, expected, 'has correct values');
});

QUnit.test('Should return a new list', function(assert) {
  const xs = [1,2,3];
  const ys = add(xs, 3);
  assert.notEqual(xs, ys, 'is not the same reference');
});
