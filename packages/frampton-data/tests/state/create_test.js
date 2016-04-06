import model from 'frampton-data/state/create';

QUnit.module('Frampton.Data.State.create');

QUnit.test('Should return a function', function() {

  const obj = { one : 1, two : 2, three : 3 };
  const test = model(obj);

  equal(typeof test, 'function');
});

QUnit.test('Should return a new object keys/values from given object', function() {

  const obj = { one : 1, two : 2, three : 3 };
  const test = model(obj);

  equal(obj.one, test.one);
  equal(obj.two, test.two);
  equal(obj.three, test.three);
});