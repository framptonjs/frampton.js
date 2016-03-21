import filter from 'frampton-record/filter';

QUnit.module('Frampton.Record.filter');

QUnit.test('should filter keys from object if value satisfies predicate', function() {

  var obj = { one: 1, two: 2, three: 3 };
  var predicate = val => (val >= 2);

  deepEqual(filter(predicate, obj), { two: 2, three: 3}, 'correctly filters object');
});