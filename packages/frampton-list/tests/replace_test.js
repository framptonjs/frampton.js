import replace from 'frampton-list/replace';

QUnit.module('Frampton.List.replace');

QUnit.test('Should replace old object with new object', function() {
  const xs = [1, 2, 3];
  deepEqual(replace(1, 9, xs), [9, 2, 3]);
});

QUnit.test('Should return original array if object missing', function() {
  const xs = [1, 2, 3];
  deepEqual(replace(10, 9, xs), [1, 2, 3]);
});

QUnit.test('Should rnot modify original array', function() {
  const xs = [1, 2, 3];
  replace(1, 9, xs);
  deepEqual(xs, [1, 2, 3]);
});