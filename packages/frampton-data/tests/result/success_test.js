import Success from 'frampton-data/result/success';

QUnit.module('Frampton.Data.Result.Success');

QUnit.test('toString method should provide proper representation', function(assert) {
  const result = Success(5);
  const actual = result.toString();
  const expected = 'Success(5)';
  assert.equal(actual, expected);
});

QUnit.test('map method should correctly update value', function(assert) {
  const result = Success(5);
  const mapping = (val) => val + 3;
  const actual = result.map(mapping).toString();
  const expected = 'Success(8)';
  assert.equal(actual, expected);
});

QUnit.test('filter method should return failure for failed predicate', function(assert) {
  const result = Success(5);
  const predicate = (val) => val < 3;
  const actual = result.filter(predicate).toString();
  const expected = 'Failure(5)';
  assert.equal(actual, expected);
});

QUnit.test('filter method should return success for passed predicate', function(assert) {
  const result = Success(5);
  const predicate = (val) => val > 3;
  const actual = result.filter(predicate).toString();
  const expected = 'Success(5)';
  assert.equal(actual, expected);
});

QUnit.test('mapFailure method should return unaltered Success', function(assert) {
  const result = Success(5);
  const mapping = (val) => val + 3;
  const actual = result.mapFailure(mapping).toString();
  const expected = 'Success(5)';
  assert.equal(actual, expected);
});

QUnit.test('isSuccess method should return true', function(assert) {
  const result = Success(5);
  const actual = result.isSuccess();
  const expected = true;
  assert.equal(actual, expected);
});

QUnit.test('isFailure method should return false', function(assert) {
  const result = Success(5);
  const actual = result.isFailure();
  const expected = false;
  assert.equal(actual, expected);
});

QUnit.test('fork method should return value of correct callback', function(assert) {
  const result = Success(5);
  const onSuccess = (val) => val + 5;
  const onError = (val) => val - 3;
  const actual = result.fork(onSuccess, onError);
  const expected = 10;
  assert.equal(actual, expected);
});
