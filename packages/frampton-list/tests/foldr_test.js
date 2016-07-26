import foldr from 'frampton-list/foldr';

QUnit.module('Frampton.List.foldr');

QUnit.test('should combine values in array with given function', function(assert) {
  var xs = ['a', 'b', 'c'];
  var fn = (acc, next) => (acc + next);
  assert.equal(foldr(fn, '', xs), 'cba');
});
