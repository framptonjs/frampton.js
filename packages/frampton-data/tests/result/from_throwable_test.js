import fromThrowable from 'frampton-data/result/from_throwable';

QUnit.module('Frampton.Data.Result.fromThrowable');

QUnit.test('Should create function that returns a Success on successful application', function(assert) {
  const throwable = (val) => {
    if (val > 5) {
      throw new Error('Number too big');
    } else {
      return val + 5;
    }
  };
  const safeThrowable = fromThrowable(throwable);
  const actual = safeThrowable(3).toString();
  const expected = 'Success(8)';
  assert.equal(actual, expected);
});

QUnit.test('Should create function that returns a Failure if given function throws', function(assert) {
  const throwable = (val) => {
    if (val > 5) {
      throw new Error('Number too big');
    } else {
      return val + 5;
    }
  };
  const safeThrowable = fromThrowable(throwable);
  const actual = safeThrowable(8).toString();
  const expected = 'Failure(Number too big)';
  assert.equal(actual, expected);
});
