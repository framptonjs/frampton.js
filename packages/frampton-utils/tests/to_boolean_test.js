import toBoolean from 'frampton-utils/to_boolean';

QUnit.module('Frampton.Utils.toBoolean');

QUnit.test('returns true for a truthy value', function(assert) {
  const test = 'test';
  assert.equal(toBoolean(test), true);
});

QUnit.test('returns false for a falsy value', function(assert) {
  const test = '';
  assert.equal(toBoolean(test), false);
});
