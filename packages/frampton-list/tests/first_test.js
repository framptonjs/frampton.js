import first from 'frampton-list/first';

QUnit.module('Frampton.List.first');

QUnit.test('returns first item in array', function(assert) {
  var xs = [1,2,3];
  assert.equal(first(xs), 1);
});
