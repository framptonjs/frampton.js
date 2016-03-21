import copy from 'frampton-record/copy';

QUnit.module('Frampton.Record.copy');

QUnit.test('should return a copy of an object', function() {

  var obj = { one: 1, two: 2, three: 3 };
  var newObj = copy(obj);

  ok(obj !== newObj);
  deepEqual(obj, newObj);
});