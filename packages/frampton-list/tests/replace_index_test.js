import replace from 'frampton-list/replace_index';

QUnit.module('Frampton.List.replaceIndex');

QUnit.test('Should replace object at given index with new object', function() {
  const xs = [1, 2, 3];
  deepEqual(replace(1, 9, xs), [1, 9, 3]);
});

QUnit.test('Should not modiby original array', function() {
  const xs = [1, 2, 3];
  replace(1, 9, xs);
  deepEqual(xs, [1, 2, 3]);
});