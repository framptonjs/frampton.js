import once from 'frampton-utils/once';

QUnit.module('Frampton.Utils.once');

QUnit.test('should return true if a function returns falsy value', function() {
  var counter = 0;
  const fn = once(function() {
    counter += 1;
  });

  fn();
  fn();
  fn();

  equal(counter, 1);
});
