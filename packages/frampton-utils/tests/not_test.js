import not from 'frampton-utils/not';

QUnit.module('Frampton.Utils.not');

const test = (num) => num > 3;

QUnit.test('returns true if a function returns falsy value', function(assert) {
  assert.ok(not(test)(2));
});

QUnit.test('returns false if a function returns truthy value', function(assert) {
  assert.notOk(not(test)(4));
});
