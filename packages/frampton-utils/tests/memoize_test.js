import memoize from 'frampton-utils/memoize';

QUnit.module('Frampton.Utils.memoize');

QUnit.test('should wrap a function so it always returns same value for same argument', function() {
  var count = 1;
  var temp = memoize(function(key) {
    return count++;
  });
  equal(temp('foo'), 1, 'returns correct inital value');
  equal(temp('foo'), 1, 'returns correct cached value');
  equal(temp('bar'), 2, 'returns correct value for new input');
});