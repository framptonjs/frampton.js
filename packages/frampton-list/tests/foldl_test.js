import foldl from 'frampton-list/foldl';

QUnit.module('Frampton.List.foldl');

QUnit.test('should combine values in array with given function', function(assert) {
  var xs = ['a', 'b', 'c'];
  var fn = (acc, next) => (acc + next);
  assert.equal(foldl(fn, '', xs), 'abc');
});
