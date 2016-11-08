import sum from 'frampton-list/sum';

QUnit.module('Frampton.List.sum');

QUnit.test('returns sum of elements in a list', function(assert) {
  const xs = [1,2,3];
  assert.equal(sum(xs), 6);
});
