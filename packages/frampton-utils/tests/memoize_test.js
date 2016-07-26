import memoize from 'frampton-utils/memoize';

QUnit.module('Frampton.Utils.memoize');

QUnit.test('should wrap a function so it always returns same value for same argument', function(assert) {
  var count = 1;
  var temp = memoize((key) => {
    return count++;
  });
  assert.equal(temp('foo'), 1, 'returns correct inital value');
  assert.equal(temp('foo'), 1, 'returns correct cached value');
  assert.equal(temp('bar'), 2, 'returns correct value for new input');
});
