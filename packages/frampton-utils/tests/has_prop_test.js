import hasProp from 'frampton-utils/has_prop';

QUnit.module('Frampton.Utils.hasProp');

QUnit.test('Should return true if the object has given prop', function() {
  const temp = { id : 1 };
  ok(hasProp('id', temp));
});

QUnit.test('Should return false if an object does not have given prop', function() {
  const temp = { id : 1 };
  notOk(hasProp('wrong', temp));
});

QUnit.test('Should return false if object is null', function() {
  notOk(hasProp('wrong', null));
});

QUnit.test('Should return return true if object has nested prop', function() {
  const temp = { data : { id : 1 } };
  ok(hasProp('data.id', temp));
});

QUnit.test('Should return return false if object does not have nested prop', function() {
  const temp = { data : { id : 1 } };
  notOk(hasProp('data.wrong', temp));
});