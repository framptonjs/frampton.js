import drop from 'frampton-list/drop';

QUnit.module('Frampton.List.drop');

QUnit.test('should return a new array with the given value removed', function() {
  var xs = [1,2,3];
  deepEqual(drop(1, xs), [2,3], 'has correct values');
});