import reduce from 'frampton-object/reduce';

QUnit.module('Frampton.Object.reduce');

QUnit.test('should reduce an object to another value', function() {

  var obj = { one: 1, two: 2, three: 3 };
  var reduction = (acc, val) => (acc + val);

  equal(reduce(reduction, 0, obj), 6, 'correctly reduces object');
});