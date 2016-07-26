import map from 'frampton-record/map';

QUnit.module('Frampton.Record.map');

QUnit.test('should map the values of an object', function(assert) {
  const obj = { one: 1, two: 2, three: 3 };
  const mapping = (val) => (val + 1);
  const actual = map(mapping, obj);
  const expected = { one: 2, two: 3, three: 4 };
  assert.deepEqual(actual, expected, 'correctly maps object');
});
