import remove from 'frampton-list/remove';

QUnit.module('Frampton.List.remove');

QUnit.test('should return a new array with the given value removed', function() {
  var xs = [1,2,3];
  deepEqual(remove(1, xs), [2,3], 'has correct values');
});