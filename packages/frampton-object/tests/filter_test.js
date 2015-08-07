import filter from 'frampton-object/filter';

QUnit.module('Frampton.Object.filter');

QUnit.test('should filter keys from object if value satisfies predicate', function() {

  var obj = { one: 1, two: 2, three: 3 };
  var predicate = val => (val >= 2);

  deepEqual(filter(predicate, obj), { two: 2, three: 3}, 'correctly filters object');
});