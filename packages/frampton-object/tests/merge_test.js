import merge from 'frampton-object/merge';

QUnit.module('Frampton.Object.merge');

QUnit.test('should create a new object with values from two objects', function() {
  var obj = { one: 1, two: 2 };
  var obj2 = { three: 3, four: 4 };
  deepEqual(merge(obj, obj2), { one: 1, two: 2, three: 3, four: 4 });
});

QUnit.test('should give second object precidence', function() {
  var obj = { one: 1, two: 2, three: 3 };
  var obj2 = { three: 33, four: 4 };
  deepEqual(merge(obj, obj2), { one: 1, two: 2, three: 33, four: 4 });
});