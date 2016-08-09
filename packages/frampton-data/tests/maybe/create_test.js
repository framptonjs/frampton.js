import { create as Maybe } from 'frampton-data/maybe/create';

QUnit.module('Frampton.Data.Maybe.create');

QUnit.test('toString method should provide proper representation', function(assert) {
  const maybe = Maybe(5);
  const actual = maybe.toString();
  const expected = 'Just(5)';
  assert.equal(actual, expected);
});

QUnit.test('toString method should work with nested Maybes', function(assert) {
  const maybe = Maybe(Maybe(5));
  const actual = maybe.toString();
  const expected = 'Just(Just(5))';
  assert.equal(actual, expected);
});

QUnit.test('Should return Nothing for null value', function(assert) {
  const maybe = Maybe(null);
  const actual = maybe.toString();
  const expected = 'Nothing';
  assert.equal(actual, expected);
});

QUnit.test('Should return Nothing for undefined value', function(assert) {
  const maybe = Maybe(undefined);
  const actual = maybe.toString();
  const expected = 'Nothing';
  assert.equal(actual, expected);
});
