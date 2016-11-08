import { createMaybe } from 'frampton-data/maybe/create';

QUnit.module('Frampton.Data.Maybe.create');

QUnit.test('toString method provides proper representation', function(assert) {
  const maybe = createMaybe(5);
  const actual = maybe.toString();
  const expected = 'Just(5)';
  assert.equal(actual, expected);
});

QUnit.test('toString method works with nested Maybes', function(assert) {
  const maybe = createMaybe(createMaybe(5));
  const actual = maybe.toString();
  const expected = 'Just(Just(5))';
  assert.equal(actual, expected);
});

QUnit.test('returns Nothing for null value', function(assert) {
  const maybe = createMaybe(null);
  const actual = maybe.toString();
  const expected = 'Nothing';
  assert.equal(actual, expected);
});

QUnit.test('returns Nothing for undefined value', function(assert) {
  const maybe = createMaybe(undefined);
  const actual = maybe.toString();
  const expected = 'Nothing';
  assert.equal(actual, expected);
});
