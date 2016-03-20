import keys from 'frampton-record/keys';

QUnit.module('Frampton.Record.keys');

QUnit.test('Should return array of objects keys', function() {
  const map = { one : 1, two : 2, three : 3 };
  deepEqual(keys(map), ['one', 'two', 'three']);
});

QUnit.test('Should not return properties on the prototype', function() {
  const map = { one : 1, two : 2, three : 3 };
  const map2 = Object.create(map);
  map2.four = 4;
  map2.five = 5;
  map2.six = 6;
  deepEqual(keys(map2), ['four', 'five', 'six']);
});