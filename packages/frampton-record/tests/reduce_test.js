import reduce from 'frampton-record/reduce';

QUnit.module('Frampton.Record.reduce');

QUnit.test('should reduce an object to another value', function(assert) {

  const obj = { one: 1, two: 2, three: 3 };
  const reduction = (acc, val) => (acc + val);
  const actual = reduce(reduction, 0, obj);
  const expected = 6;

  assert.equal(actual, expected, 'correctly reduces object');
});
