import copy from 'frampton-list/copy';

QUnit.module('Frampton.List.copy');

QUnit.test('should return a new object', function(assert) {
  const xs = [1,2,3];
  const ys = copy(xs);
  assert.notEqual(xs, ys, 'is not the same reference');
});

QUnit.test('should return an array with the values of the given array', function(assert) {
  const xs = [1,2,3];
  const ys = copy(xs);
  assert.deepEqual(ys, xs, 'has correct values');
});

QUnit.test('should take optional parameter to trim beginning of copied array', function(assert) {
  const xs = [1,2,3];
  const ys = copy(xs, 1);
  assert.deepEqual(ys, [2,3], 'has correct values');
});

QUnit.test('should take optional parameter to trim end of copied array', function(assert) {
  const xs = [1,2,3];
  const ys = copy(xs, 0, 2);
  assert.deepEqual(ys, [1,2], 'has correct values');
});
