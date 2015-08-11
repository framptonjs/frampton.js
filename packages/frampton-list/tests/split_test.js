import split from 'frampton-list/split';

QUnit.module('Frampton.List.split');

QUnit.test('should split an array at given index, returning two new arrays', () => {
  var xs = [1,2,3,4,5,6];
  deepEqual(split(3,xs), [[1,2,3],[4,5,6]]);
});