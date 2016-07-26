import filter from 'frampton-record/filter';

QUnit.module('Frampton.Record.filter');

QUnit.test('should filter keys from object if value satisfies predicate', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const predicate = val => (val >= 2);
  const actual = filter(predicate, obj);
  const expected = { two: 2, three: 3};
  assert.deepEqual(actual, expected, 'correctly filters object');
});
