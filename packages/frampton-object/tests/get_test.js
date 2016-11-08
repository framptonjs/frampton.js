import get from 'frampton-object/get';

QUnit.module('Frampton.Object.get');

QUnit.test('retrieves value by key', function(assert) {
  const temp = { id : 1 };
  assert.equal(get('id', temp), 1);
});

QUnit.test('returns null for invalid key', function(assert) {
  const temp = { id : 1 };
  assert.equal(get('wrong', temp), null);
});

QUnit.test('returns correct nested value', function(assert) {
  const temp = { data : { obj : { id : 1 } } };
  assert.equal(get('data.obj.id', temp), 1);
});

QUnit.test('returns null for missing nested value', function(assert) {
  const temp = { data : { id : 1 } };
  assert.equal(get('data.wrong', temp), null);
});

QUnit.test('returns null for missing nested root', function(assert) {
  const temp = { data : { id : 1 } };
  assert.equal(get('wrong.id', temp), null);
});

QUnit.test('returns value at index', function(assert) {
  const temp = ['one', 'two', 'three'];
  assert.equal(get(1, temp), 'two');
});

QUnit.test('returns null for missing index', function(assert) {
  const temp = ['one', 'two', 'three'];
  assert.equal(get(5, temp), null);
});
