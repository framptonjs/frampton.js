import extend from 'frampton-utils/extend';

QUnit.module('Frampton.Utils.extend');

QUnit.test('Should copy values to object', function(assert) {
  const temp = { id : 1 };
  const temp2 = { foo : 'bar' };
  const actual = extend({}, temp, temp2);
  const expected = { id : 1, foo : 'bar' };
  assert.deepEqual(actual, expected);
});
