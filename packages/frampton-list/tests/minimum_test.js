import min from 'frampton-list/minimum';

QUnit.module('Frampton.List.minimum');

QUnit.test('should return the min value in an array', () => {
  var xs = [1,2,9,4,0,3];
  equal(min(xs), 0);
});