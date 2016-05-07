import removeIndex from 'frampton-list/remove_index';

QUnit.module('Frampton.List.removeIndex');

QUnit.test('Should return a new array with the given index removed', function() {
  const xs = ['one', 'two', 'three'];
  deepEqual(removeIndex(1, xs), ['one', 'three']);
});

QUnit.test('Should not modify original array', function() {
  const xs = ['one', 'two', 'three'];
  deepEqual(removeIndex(1, xs), ['one', 'three']);
  deepEqual(xs, ['one', 'two', 'three']);
});