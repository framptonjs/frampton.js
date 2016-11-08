import once from 'frampton-utils/once';

QUnit.module('Frampton.Utils.once');

QUnit.test('returns true if a function returns falsy value', function(assert) {
  var counter = 0;
  const fn = once(() => {
    counter += 1;
  });

  fn();
  fn();
  fn();

  assert.equal(counter, 1);
});
