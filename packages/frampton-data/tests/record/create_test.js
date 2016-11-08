import createRecord from 'frampton-data/record/create';

QUnit.module('Frampton.Data.Record.create');

QUnit.test('returns an object with update function', function(assert) {

  const obj = { one : 1, two : 2, three : 3 };
  const test = createRecord(obj);

  assert.equal(typeof test.update, 'function');
});

QUnit.test('returns an object with data function', function(assert) {

  const obj = { one : 1, two : 2, three : 3 };
  const test = createRecord(obj);

  assert.equal(typeof test.update, 'function');
});

QUnit.test('returns a new object keys/values from given object', function(assert) {

  const obj = { one : 1, two : 2, three : 3 };
  const test = createRecord(obj);

  assert.equal(obj.one, test.one);
  assert.equal(obj.two, test.two);
  assert.equal(obj.three, test.three);
});

QUnit.test('data method returns correct keys/values', function(assert) {

  const obj = { one : 1, two : 2, three : 3 };
  const test = createRecord(obj);
  const actual = test.data();

  assert.deepEqual(actual, obj);
});

QUnit.test('update method updates values', function(assert) {

  const obj = { one : 1, two : 2, three : 3 };
  const test = createRecord(obj);
  const actual = test.update({
    two : 4
  });
  const expected = { one : 1, two : 4, three : 3 };

  assert.deepEqual(actual.data(), expected);
});

QUnit.test('update method returns new reference', function(assert) {

  const obj = { one : 1, two : 2, three : 3 };
  const test = createRecord(obj);
  const actual = test.update({
    two : 4
  });

  assert.notEqual(actual, test);
});

QUnit.test('update method does not mutate original object', function(assert) {

  const obj = { one : 1, two : 2, three : 3 };
  const test = createRecord(obj);
  test.update({ two : 4 });

  assert.deepEqual(test.data(), obj);
});

QUnit.test('map method updates object with function', function(assert) {

  const obj = { one : 1, two : 2, three : 3 };
  const test = createRecord(obj);
  const actual = test.map((value, key) => {
    return value + 2;
  });
  const expected = { one : 3, two : 4, three : 5 };

  assert.deepEqual(actual.data(), expected);
});

QUnit.test('reduce method reduces object with function', function(assert) {

  const obj = { one : 1, two : 2, three : 3 };
  const test = createRecord(obj);
  const actual = test.reduce((acc, nextVal, nextKey) => {
    return acc + nextVal;
  }, 0);
  const expected = 6;

  assert.equal(actual, expected);
});
