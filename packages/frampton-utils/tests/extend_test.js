import extend from 'frampton-utils/extend';

QUnit.module('Frampton.Utils.extend');

QUnit.test('Should copy values to object', function() {
  const temp = { id : 1 };
  const temp2 = { foo : 'bar' };
  const expected = { id : 1, foo : 'bar' };
  deepEqual(extend({}, temp, temp2), expected);
});
