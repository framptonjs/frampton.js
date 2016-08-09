import Nothing from 'frampton-data/maybe/nothing';
import { create as Maybe } from 'frampton-data/maybe/create';

QUnit.module('Frampton.Data.Maybe.Nothing');

QUnit.test('Should create a Nothing', function(assert) {
  const maybe = Nothing();
  const actual = maybe.toString();
  const expected = 'Nothing';
  assert.equal(actual, expected);
});

QUnit.test('Should create a Nothing even form valid value', function(assert) {
  const maybe = Nothing(5);
  const actual = maybe.toString();
  const expected = 'Nothing';
  assert.equal(actual, expected);
});

QUnit.test('map method should return a nothing', function(assert) {
  const maybe = Nothing();
  const mapping = (val) => val + 3;
  const actual = maybe.map(mapping).toString();
  const expected = 'Nothing';
  assert.equal(actual, expected);
});

QUnit.test('filter method should return a nothing', function(assert) {
  const maybe = Nothing();
  const predicate = (val) => val > 3;
  const actual = maybe.filter(predicate).toString();
  const expected = 'Nothing';
  assert.equal(actual, expected);
});

QUnit.test('chain method should return a nothing', function(assert) {
  const nothing = Nothing();
  const mapping = (val) => Maybe(val + 1);
  const actual = nothing.chain(mapping).toString();
  const expected = 'Nothing';
  assert.equal(actual, expected);
});

QUnit.test('get method should throw', function(assert) {
  const maybe = Nothing();
  assert.throws(() => maybe.get());
});

QUnit.test('getOrElse method should return default value', function(assert) {
  const maybe = Nothing();
  const actual = maybe.getOrElse(5);
  const expected = 5;
  assert.equal(actual, expected);
});

QUnit.test('isJust method should return false', function(assert) {
  const maybe = Nothing();
  const actual = maybe.isJust();
  const expected = false;
  assert.equal(actual, expected);
});

QUnit.test('isNothing method should return true', function(assert) {
  const maybe = Nothing();
  const actual = maybe.isNothing();
  const expected = false;
  assert.equal(actual, expected);
});
