import add from 'frampton-list/add';

QUnit.module('Frampton.List.add');

QUnit.test('Should return a new array with value added', function(assert) {
  const xs = [1,2,3];
  const actual = add(xs, 4);
  const expected = [1,2,3,4];
  assert.deepEqual(actual, expected);
});

QUnit.test('Should not add the value if array already contains it', function(assert) {
  const xs = [1,2,3];
  const actual = add(xs, 3);
  const expected = [1,2,3];
  assert.deepEqual(actual, expected);
});

QUnit.test('Should return the same reference if the element exists', function(assert) {
  const xs = [1,2,3];
  const ys = add(xs, 3);
  assert.equal(xs, ys);
});

QUnit.test('Should return new reference when modifying array', function(assert) {
  const xs = [1,2,3];
  const ys = add(xs, 4);
  assert.notEqual(xs, ys);
});
