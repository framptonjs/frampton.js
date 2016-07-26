import max from 'frampton-list/max';

QUnit.module('Frampton.List.max');

QUnit.test('should return the max value in an array', function(assert) {
  var xs = [1,2,9,4,0,3];
  assert.equal(max(xs), 9);
});
