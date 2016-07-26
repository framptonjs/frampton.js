import length from 'frampton-list/length';

QUnit.module('Frampton.List.length');

QUnit.test('should return the length of an array', function(assert) {
  var xs = [1,2,3];
  assert.equal(length(xs), 3);
});

QUnit.test('should return the length property of any object', function(assert) {
  var xs = { length: 4 };
  assert.equal(length(xs), 4);
});

QUnit.test('should return 0 if an object has no length', function(assert) {
  var xs = {};
  assert.equal(length(xs), 0);
});

QUnit.test('should return 0 for null', function(assert) {
  assert.equal(length(null), 0);
});
