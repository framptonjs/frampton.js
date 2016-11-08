import fromThrowable from 'frampton-data/result/from_throwable';

QUnit.module('Frampton.Data.Result.fromThrowable');

QUnit.test('creates function that returns a Success on successful application', function(assert) {
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

QUnit.test('creates function that returns a Failure if given function throws', function(assert) {
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

QUnit.test('returns a curried function that handles success', function(assert) {
  const throwable = (first, second) => {
    if (first > second) {
      throw new Error('Wrong');
    } else {
      return second;
    }
  };
  const safeThrowable = fromThrowable(throwable);
  const testSix = safeThrowable(6);
  const actual = testSix(8).toString();
  const expected = 'Success(8)';
  assert.equal(actual, expected);
});

QUnit.test('returns a curried function that handles failure', function(assert) {
  const throwable = (first, second) => {
    if (first > second) {
      throw new Error('Wrong');
    } else {
      return second;
    }
  };
  const safeThrowable = fromThrowable(throwable);
  const testSix = safeThrowable(6);
  const actual = testSix(4).toString();
  const expected = 'Failure(Wrong)';
  assert.equal(actual, expected);
});

QUnit.test('returned function does not require an argument', function(assert) {
  const throwable = () => {
    return 'Ok';
  };
  const safeThrowable = fromThrowable(throwable);
  const actual = safeThrowable().toString();
  const expected = 'Success(Ok)';
  assert.equal(actual, expected);
});
