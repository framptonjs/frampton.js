import Nothing from 'frampton-data/maybe/nothing';
import { createMaybe } from 'frampton-data/maybe/create';

QUnit.module('Frampton.Data.Maybe.Nothing');

QUnit.test('creates a Nothing', function(assert) {
  const maybe = Nothing();
  const actual = maybe.toString();
  const expected = 'Nothing';
  assert.equal(actual, expected);
});

QUnit.test('creates a Nothing even form valid value', function(assert) {
  const maybe = Nothing(5);
  const actual = maybe.toString();
  const expected = 'Nothing';
  assert.equal(actual, expected);
});

QUnit.test('fork method uses first function on a Nothing', function(assert) {
  const maybe = createMaybe(undefined);
  const actual = maybe.fork((val) => val + 2, () => 10);
  const expected = 10;
  assert.equal(actual, expected);
});

QUnit.test('map method returns a Nothing', function(assert) {
  const maybe = Nothing();
  const mapping = (val) => val + 3;
  const actual = maybe.map(mapping).toString();
  const expected = 'Nothing';
  assert.equal(actual, expected);
});

QUnit.test('filter method returns a nothing', function(assert) {
  const maybe = Nothing();
  const predicate = (val) => val > 3;
  const actual = maybe.filter(predicate).toString();
  const expected = 'Nothing';
  assert.equal(actual, expected);
});

QUnit.test('chain method returns a Nothing', function(assert) {
  const nothing = Nothing();
  const mapping = (val) => createMaybe(val + 1);
  const actual = nothing.chain(mapping).toString();
  const expected = 'Nothing';
  assert.equal(actual, expected);
});

QUnit.test('get method throws', function(assert) {
  const maybe = Nothing();
  assert.throws(() => maybe.get());
});

QUnit.test('getOrElse method returns default value', function(assert) {
  const maybe = Nothing();
  const actual = maybe.getOrElse(5);
  const expected = 5;
  assert.equal(actual, expected);
});

QUnit.test('isJust method returns false', function(assert) {
  const maybe = Nothing();
  const actual = maybe.isJust();
  const expected = false;
  assert.equal(actual, expected);
});

QUnit.test('isNothing method returns true', function(assert) {
  const maybe = Nothing();
  const actual = maybe.isNothing();
  const expected = true;
  assert.equal(actual, expected);
});
