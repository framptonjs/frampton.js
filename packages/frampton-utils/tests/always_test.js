import always from 'frampton-utils/always';

QUnit.module('Frampton.Utils.always');

QUnit.test('Should create a function that is always given the same argument', function() {
  const test = always((val) => val + 2, 3);
  equal(test(9), 5);
  equal(test(15), 5);
});