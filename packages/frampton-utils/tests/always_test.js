import always from 'frampton-utils/always';

QUnit.module('Frampton.Utils.always');

QUnit.test('Should create a function that is always given the same argument', function(assert) {
  const test = always((val) => val + 2, 3);
  assert.equal(test(9), 5);
  assert.equal(test(15), 5);
});
