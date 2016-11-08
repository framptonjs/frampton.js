import hasProp from 'frampton-utils/has_prop';

QUnit.module('Frampton.Utils.hasProp');

QUnit.test('returns true if the object has given prop', function(assert) {
  const temp = { id : 1 };
  assert.ok(hasProp('id', temp));
});

QUnit.test('returns false if an object does not have given prop', function(assert) {
  const temp = { id : 1 };
  assert.notOk(hasProp('wrong', temp));
});

QUnit.test('returns false if object is null', function(assert) {
  assert.notOk(hasProp('wrong', null));
});

QUnit.test('returns return true if object has nested prop', function(assert) {
  const temp = { data : { id : 1 } };
  assert.ok(hasProp('data.id', temp));
});

QUnit.test('returns return false if object does not have nested prop', function(assert) {
  const temp = { data : { id : 1 } };
  assert.notOk(hasProp('data.wrong', temp));
});
