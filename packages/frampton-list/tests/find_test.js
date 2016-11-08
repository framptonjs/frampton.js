import find from 'frampton-list/find';

QUnit.module('Frampton.List.find');

QUnit.test('returns first index of given value', function(assert) {
  const xs = [1,2,3,4,5];
  assert.equal(find(3, xs), 2);
});

QUnit.test('returns -1 for missing value', function(assert) {
  const xs = [1,2,3,4,5];
  assert.equal(find(18, xs), -1);
});
