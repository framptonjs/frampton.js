import drop from 'frampton-list/drop';

QUnit.module('Frampton.List.drop');

QUnit.test('should return a new array with the first n elements removed', function() {
  var xs = [1,2,3,4,5];
  deepEqual(drop(2, xs), [3,4,5], 'has correct values');
});