import curryN from 'frampton-utils/curry_n';

QUnit.module('Frampton.Utils.curryN');

QUnit.test('Should create a function that waits for the specified number of arguments', function() {
  var count = 0;
  var a = function(x, y, c, d) {
    equal(count, 4, 'waits for all arguments');
    return (x + y + c + d);
  };
  var b = curryN(4, a);
  count++;
  var c = b(2);
  count++;
  var d = c(3);
  count++;
  var e = d(4);
  count++;
  equal(e(3), 12);
});

QUnit.test('Should take optional initial arguments', function() {
  var count = 0;
  var a = function(x, y, c, d) {
    equal(count, 2, 'waits for all arguments');
    return (x + y + c + d);
  };
  var b = curryN(4, a, 2, 3);
  count++;
  var e = b(4);
  count++;
  equal(e(3), 12);
});