import safeGet from 'frampton-utils/safe_get';

QUnit.module('Frampton.Utils.safeGet');

QUnit.test('should return Just for existing key', function() {
  var temp = { id : 1 };
  ok(safeGet('id', temp).isJust(), 'correctly returns Just');
});

QUnit.test('should return Nothing for invalid key', function() {
  var temp = { id : 1 };
  ok(safeGet('wrong', temp).isNothing(), 'correctly returns Nothing');
});

QUnit.test('should return Just for existing key', function() {
  var temp = { id : 1 };
  equal(safeGet('id', temp).toString(), 'Just(1)', 'correctly returns Just');
});

QUnit.test('should return Nothing for invalid key', function() {
  var temp = { id : 1 };
  equal(safeGet('wrong', temp).toString(), 'Nothing', 'correctly returns Nothing');
});