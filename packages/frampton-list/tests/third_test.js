import third from 'frampton-list/third';

QUnit.module('Frampton.List.third');

QUnit.test('returns third item in array', function(assert) {
  var xs = [1,2,3];
  assert.equal(third(xs), 3);
});
