import at from 'frampton-list/at';

QUnit.module('Frampton.List.at');

QUnit.test('Should return item at given index', function(assert) {
  var xs = [1,2,3];
  assert.equal(at(0, xs), 1);
  assert.equal(at(1, xs), 2);
  assert.equal(at(2, xs), 3);
});
