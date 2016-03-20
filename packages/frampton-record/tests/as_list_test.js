import asList from 'frampton-record/as_list';

QUnit.module('Frampton.Record.asList');

QUnit.test('returns a list of pairs for an object', function() {
  var map = { one : 1, two : 2, three : 3 };
  deepEqual(asList(map), [['one',1], ['two',2], ['three',3]]);
});