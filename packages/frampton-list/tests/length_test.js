import length from 'frampton-list/length';

QUnit.module('Frampton.List.length');

QUnit.test('should return the length of an array', function() {
  var xs = [1,2,3];
  equal(length(xs), 3);
});

QUnit.test('should return the length property of any object', function() {
  var xs = { length: 4 };
  equal(length(xs), 4);
});

QUnit.test('should return 0 if an object has no length', function() {
  var xs = {};
  equal(length(xs), 0);
});

QUnit.test('should return 0 for null', function() {
  equal(length(null), 0);
});