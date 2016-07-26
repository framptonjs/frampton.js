import contains from 'frampton-list/contains';

QUnit.module('Frampton.List.contains');

QUnit.test('should return true if a list contains a value', function(assert) {
  var xs = [1,2,3];
  assert.ok(contains(xs, 3), 'correctly detected value');
});

QUnit.test('should return false if a list does not contain a value', function(assert) {
  var xs = [1,2,3];
  assert.notOk(contains(xs, 5), 'correctly detected value');
});
