import keys from 'frampton-record/keys';

QUnit.module('Frampton.Record.keys');

QUnit.test('Should return array of objects keys', function(assert) {
  const map = { one : 1, two : 2, three : 3 };
  const actual = keys(map);
  const expected = ['one', 'two', 'three'];
  assert.deepEqual(actual, expected);
});

QUnit.test('Should not return properties on the prototype', function(assert) {
  const map = { one : 1, two : 2, three : 3 };
  const map2 = Object.create(map);
  map2.four = 4;
  map2.five = 5;
  map2.six = 6;
  const actual = keys(map2);
  const expected = ['four', 'five', 'six'];
  assert.deepEqual(actual, expected);
});
