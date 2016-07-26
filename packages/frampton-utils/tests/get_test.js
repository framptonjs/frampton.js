import get from 'frampton-utils/get';

QUnit.module('Frampton.Utils.get');

QUnit.test('Should retrieve value by key', function(assert) {
  const temp = { id : 1 };
  assert.equal(get('id', temp), 1);
});

QUnit.test('Should return null for invalid key', function(assert) {
  const temp = { id : 1 };
  assert.equal(get('wrong', temp), null);
});

QUnit.test('Should return correct nested value', function(assert) {
  const temp = { data : { obj : { id : 1 } } };
  assert.equal(get('data.obj.id', temp), 1);
});

QUnit.test('Should return null for missing nested value', function(assert) {
  const temp = { data : { id : 1 } };
  assert.equal(get('data.wrong', temp), null);
});

QUnit.test('Should return null for missing nested root', function(assert) {
  const temp = { data : { id : 1 } };
  assert.equal(get('wrong.id', temp), null);
});

QUnit.test('Should return value at index', function(assert) {
  const temp = ['one', 'two', 'three'];
  assert.equal(get(1, temp), 'two');
});

QUnit.test('Should return null for missing index', function(assert) {
  const temp = ['one', 'two', 'three'];
  assert.equal(get(5, temp), null);
});
