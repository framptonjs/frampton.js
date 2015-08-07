import asList from 'frampton-object/as_list';

QUnit.module('Frampton.Object.reduce');

QUnit.test('returns a list of pairs for an object', function() {
  var map = { one : 1, two : 2, three : 3 };
  deepEqual(asList(map), [['one',1], ['two',2], ['three',3]]);
});