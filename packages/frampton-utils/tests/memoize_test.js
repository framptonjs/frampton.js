import memoize from 'frampton-utils/memoize';

QUnit.module('Frampton.Utils.memoize');

QUnit.test('should wrap a function so it always returns same value for same argument', function() {
  var count = 1;
  var temp = memoize(function(key) {
    return count++;
  });
  temp('foo');
  equal(temp('foo'), 1, 'correctly returns value');
  equal(temp('bar'), 2, 'correctly returns value');
});