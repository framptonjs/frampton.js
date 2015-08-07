import get from 'frampton-utils/get';

QUnit.module('Frampton.Utils.get');

QUnit.test('should retrieve value by key', function() {
  var temp = { id : 1 };
  equal(get('id', temp), 1, 'correctly returns value');
});

QUnit.test('should return null for invalid key', function() {
  var temp = { id : 1 };
  equal(get('wrong', temp), null, 'correctly returns null');
});