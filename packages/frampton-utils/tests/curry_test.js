import curry from 'frampton-utils/curry';

QUnit.module('Frampton.Utils.curry');

QUnit.test('should create a function that waits for all arguments', function(assert) {
  var count = 0;
  var a = function(x, y, c, d) {
    assert.equal(count, 4, 'waits for all arguments');
    return (x + y + c + d);
  };
  var b = curry(a);
  count++;
  var c = b(2);
  count++;
  var d = c(3);
  count++;
  var e = d(4);
  count++;
  assert.equal(e(3), 12, 'returns correct value');
});
