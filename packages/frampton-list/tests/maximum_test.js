import max from 'frampton-list/maximum';

QUnit.module('Frampton.List.maximum');

QUnit.test('should return the max value in an array', () => {
  var xs = [1,2,9,4,0,3];
  equal(max(xs), 9);
});