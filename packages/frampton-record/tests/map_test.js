import map from 'frampton-record/map';

QUnit.module('Frampton.Record.map');

QUnit.test('should map the values of an object', function() {

  var obj = { one: 1, two: 2, three: 3 };
  var mapping = (val) => (val + 1);

  deepEqual(map(mapping, obj), { one: 2, two: 3, three: 4 }, 'correctly maps object');
});