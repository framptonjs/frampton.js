import foldr from 'frampton-list/foldr';

QUnit.module('Frampton.List.foldr');

QUnit.test('should combine values in array with given function', () => {
  var xs = ['a', 'b', 'c'];
  var fn = (acc, next) => (acc + next);
  equal(foldr(fn, '', xs), 'cba');
});