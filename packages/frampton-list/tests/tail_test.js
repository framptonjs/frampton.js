import tail from 'frampton-list/tail';

QUnit.module('Frampton.List.tail');

QUnit.test('should return new array with all but first element', () => {
  var xs = [1,2,3];
  deepEqual(tail(xs), [2,3]);
});