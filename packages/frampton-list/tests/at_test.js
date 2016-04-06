import at from 'frampton-list/at';

QUnit.module('Frampton.List.at');

QUnit.test('Should return item at given index', () => {
  var xs = [1,2,3];
  equal(at(0, xs), 1);
  equal(at(1, xs), 2);
  equal(at(2, xs), 3);
});