import Just from 'frampton-data/maybe/just';
import { create as Maybe } from 'frampton-data/maybe/create';

QUnit.module('Frampton.Data.Maybe.Just');

QUnit.test('Should create a Just of the given value', function(assert) {
  const maybe = Just(5);
  const actual = maybe.toString();
  const expected = 'Just(5)';
  assert.equal(actual, expected);
});

QUnit.test('Should force a null into a Just context', function(assert) {
  const maybe = Just(null);
  const actual = maybe.toString();
  const expected = 'Just(null)';
  assert.equal(actual, expected);
});

QUnit.test('map method should transform value of maybe', function(assert) {
  const maybe = Just(5);
  const actual = maybe.map((val) => val + 1).toString();
  const expected = 'Just(6)';
  assert.equal(actual, expected);
});

QUnit.test('filter method should turn Just to Nothing if predicate fails', function(assert) {
  const maybe = Just(5);
  const actual = maybe.filter((val) => val > 6).toString();
  const expected = 'Nothing';
  assert.equal(actual, expected);
});

QUnit.test('filter method should leave value as is if predicate passes', function(assert) {
  const maybe = Just(5);
  const actual = maybe.filter((val) => val < 6).toString();
  const expected = 'Just(5)';
  assert.equal(actual, expected);
});

QUnit.test('chain method correctly return new Maybe', function(assert) {
  const maybe = Just(5);
  const mapping = (val) => Maybe(val + 8);
  const actual = maybe.chain(mapping).toString();
  const expected = 'Just(13)';
  assert.equal(actual, expected);
});

QUnit.test('ap method correctly apply function inside of Maybe', function(assert) {
  const fnMaybe = Just((val) => val + 3);
  const valMaybe = Maybe(5);
  const actual = fnMaybe.ap(valMaybe).toString();
  const expected = 'Just(8)';
  assert.equal(actual, expected);
});

QUnit.test('get method should get the value from Maybe', function(assert) {
  const maybe = Just(3);
  const actual = maybe.get();
  const expected = 3;
  assert.equal(actual, expected);
});

QUnit.test('getOrElse method should get the value from Just', function(assert) {
  const maybe = Just(3);
  const actual = maybe.getOrElse(10);
  const expected = 3;
  assert.equal(actual, expected);
});

QUnit.test('isJust method should return true', function(assert) {
  const maybe = Just(3);
  const actual = maybe.isJust();
  const expected = false;
  assert.equal(actual, expected);
});

QUnit.test('isNothing method should return false', function(assert) {
  const maybe = Just(3);
  const actual = maybe.isNothing();
  const expected = false;
  assert.equal(actual, expected);
});
