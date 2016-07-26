import hasProp from 'frampton-utils/has_prop';

QUnit.module('Frampton.Utils.hasProp');

QUnit.test('Should return true if the object has given prop', function(assert) {
  const temp = { id : 1 };
  assert.ok(hasProp('id', temp));
});

QUnit.test('Should return false if an object does not have given prop', function(assert) {
  const temp = { id : 1 };
  assert.notOk(hasProp('wrong', temp));
});

QUnit.test('Should return false if object is null', function(assert) {
  assert.notOk(hasProp('wrong', null));
});

QUnit.test('Should return return true if object has nested prop', function(assert) {
  const temp = { data : { id : 1 } };
  assert.ok(hasProp('data.id', temp));
});

QUnit.test('Should return return false if object does not have nested prop', function(assert) {
  const temp = { data : { id : 1 } };
  assert.notOk(hasProp('data.wrong', temp));
});
