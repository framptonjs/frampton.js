import first from 'frampton-list/first';

QUnit.module('Frampton.List.first');

QUnit.test('Should return first item in array', () => {
  var xs = [1,2,3];
  equal(first(xs), 1);
});