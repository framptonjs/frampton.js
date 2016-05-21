import min from 'frampton-list/min';

QUnit.module('Frampton.List.min');

QUnit.test('should return the min value in an array', () => {
  var xs = [1,2,9,4,0,3];
  equal(min(xs), 0);
});
