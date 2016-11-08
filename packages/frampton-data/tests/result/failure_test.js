import Failure from 'frampton-data/result/failure';

QUnit.module('Frampton.Data.Result.Failure');

QUnit.test('toString method provides proper representation', function(assert) {
  const result = Failure('error');
  const actual = result.toString();
  const expected = 'Failure(error)';
  assert.equal(actual, expected);
});

QUnit.test('map method returns unaltered Failure', function(assert) {
  const result = Failure(5);
  const mapping = (val) => val + 3;
  const actual = result.map(mapping).toString();
  const expected = 'Failure(5)';
  assert.equal(actual, expected);
});

QUnit.test('filter method returns failure for failed predicate', function(assert) {
  const result = Failure(5);
  const predicate = (val) => val < 3;
  const actual = result.filter(predicate).toString();
  const expected = 'Failure(5)';
  assert.equal(actual, expected);
});

QUnit.test('filter method returns failure for passed predicate', function(assert) {
  const result = Failure(5);
  const predicate = (val) => val > 3;
  const actual = result.filter(predicate).toString();
  const expected = 'Failure(5)';
  assert.equal(actual, expected);
});

QUnit.test('mapFailure method updates value', function(assert) {
  const result = Failure(5);
  const mapping = (val) => val + 3;
  const actual = result.mapFailure(mapping).toString();
  const expected = 'Failure(8)';
  assert.equal(actual, expected);
});

QUnit.test('isSuccess method returns false', function(assert) {
  const result = Failure(5);
  const actual = result.isSuccess();
  const expected = false;
  assert.equal(actual, expected);
});

QUnit.test('isFailure method returns true', function(assert) {
  const result = Failure(5);
  const actual = result.isFailure();
  const expected = true;
  assert.equal(actual, expected);
});

QUnit.test('fork method returns value of correct callback', function(assert) {
  const result = Failure(5);
  const onSuccess = (val) => val + 5;
  const onError = (val) => val - 3;
  const actual = result.fork(onSuccess, onError);
  const expected = 2;
  assert.equal(actual, expected);
});
