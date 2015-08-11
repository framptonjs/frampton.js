import last from 'frampton-list/last';

QUnit.module('Frampton.List.last');

QUnit.test('should return last element in array', () => {
  var xs = [1,2,3];
  equal(last(xs), 3);
});