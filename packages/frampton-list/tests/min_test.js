import min from 'frampton-list/min';

QUnit.module('Frampton.List.min');

QUnit.test('should return the min value in an array', function(assert) {
  var xs = [1,2,9,4,0,3];
  assert.equal(min(xs), 0);
});
