import init from 'frampton-list/init';

QUnit.module('Frampton.List.init');

QUnit.test('should return new array with all but last element', function(assert) {
  const xs = [1,2,3];
  const actual = init(xs);
  const expected = [1,2];
  assert.deepEqual(actual, expected);
});
