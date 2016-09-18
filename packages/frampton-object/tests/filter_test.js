import filter from 'frampton-object/filter';

QUnit.module('Frampton.Object.filter');

QUnit.test('Should filter keys from object if value satisfies predicate', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const predicate = val => (val >= 2);
  const actual = filter(predicate, obj);
  const expected = { two: 2, three: 3};
  assert.deepEqual(actual, expected, 'correctly filters object');
});
